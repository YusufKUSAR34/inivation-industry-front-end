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
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [open, setOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'AIRPORT',
    latitude: '',
    longitude: '',
    city: '',
    country: '',
  });

  const fetchLocations = async () => {
    try {
      const response = await api.get<Location[]>('/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpen = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        name: location.name,
        type: location.type,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        city: location.city,
        country: location.country,
      });
    } else {
      setEditingLocation(null);
      setFormData({
        name: '',
        type: 'AIRPORT',
        latitude: '',
        longitude: '',
        city: '',
        country: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingLocation(null);
    setFormData({
      name: '',
      type: 'AIRPORT',
      latitude: '',
      longitude: '',
      city: '',
      country: '',
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
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      if (editingLocation) {
        await api.put(`/locations/${editingLocation.id}`, payload);
      } else {
        await api.post('/locations', payload);
      }
      fetchLocations();
      handleClose();
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await api.delete(`/locations/${id}`);
        fetchLocations();
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Locations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            sx={{ mb: 2 }}
          >
            Add Location
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Longitude</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.type}</TableCell>
                  <TableCell>{location.city}</TableCell>
                  <TableCell>{location.country}</TableCell>
                  <TableCell>{location.latitude}</TableCell>
                  <TableCell>{location.longitude}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(location)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(location.id)} color="error">
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
          {editingLocation ? 'Edit Location' : 'Add Location'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              select
              fullWidth
              margin="normal"
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="AIRPORT">Airport</MenuItem>
              <MenuItem value="CITY_POINT">City Point</MenuItem>

            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Latitude"
              name="latitude"
              type="number"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Longitude"
              name="longitude"
              type="number"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
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

export default LocationsPage; 