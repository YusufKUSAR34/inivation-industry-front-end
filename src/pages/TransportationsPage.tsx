import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../utils/apiInterceptor';

interface Location {
  id: number;
  name: string;
  type: 'AIRPORT' | 'CITY_POINT';
  city: string;
  country: string;
}

interface Transportation {
  id: number;
  originLocationId: number;
  destinationLocationId: number;
  transportationType: string;
  originLocationName: string;
  destinationLocationName: string;
}

const TransportationsPage: React.FC = () => {
  const [transportations, setTransportations] = useState<Transportation[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTransportation, setEditingTransportation] = useState<Transportation | null>(null);
  const [formData, setFormData] = useState({
    originLocationId: '',
    destinationLocationId: '',
    transportationType: 'FLIGHT'
  });

  const fetchTransportations = async () => {
    try {
      const response = await api.get<Transportation[]>('/transportations');
      setTransportations(response.data);
    } catch (error) {
      console.error('Error fetching transportations:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get<Location[]>('/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchTransportations();
    fetchLocations();
  }, []);

  const handleOpen = (transportation?: Transportation) => {
    if (transportation) {
      setEditingTransportation(transportation);
      setFormData({
        originLocationId: transportation.originLocationId.toString(),
        destinationLocationId: transportation.destinationLocationId.toString(),
        transportationType: transportation.transportationType
      });
    } else {
      setEditingTransportation(null);
      setFormData({
        originLocationId: '',
        destinationLocationId: '',
        transportationType: 'FLIGHT'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransportation(null);
    setFormData({
      originLocationId: '',
      destinationLocationId: '',
      transportationType: 'FLIGHT'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        originLocationId: parseInt(formData.originLocationId),
        destinationLocationId: parseInt(formData.destinationLocationId)
      };

      if (editingTransportation) {
        await api.put(`/transportations/${editingTransportation.id}`, payload);
      } else {
        await api.post('/transportations', payload);
      }
      fetchTransportations();
      handleClose();
    } catch (error) {
      console.error('Error saving transportation:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transportation?')) {
      try {
        await api.delete(`/transportations/${id}`);
        fetchTransportations();
      } catch (error) {
        console.error('Error deleting transportation:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Transportations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            sx={{ mb: 2 }}
          >
            Add Transportation
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Origin</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transportations.map((transportation) => (
                <TableRow key={transportation.id}>
                  <TableCell>{transportation.originLocationName}</TableCell>
                  <TableCell>{transportation.destinationLocationName}</TableCell>
                  <TableCell>{transportation.transportationType}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(transportation)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(transportation.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingTransportation ? 'Edit Transportation' : 'Add Transportation'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Origin Location"
              name="originLocationId"
              value={formData.originLocationId}
              onChange={handleChange}
              required
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name} ({location.city}, {location.country})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Destination Location"
              name="destinationLocationId"
              value={formData.destinationLocationId}
              onChange={handleChange}
              required
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name} ({location.city}, {location.country})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Type"
              name="transportationType"
              value={formData.transportationType}
              onChange={handleChange}
              required
            >
              <MenuItem value="FLIGHT">Flight</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default TransportationsPage; 