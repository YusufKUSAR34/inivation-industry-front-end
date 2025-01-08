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
  MenuItem,
  Grid,
  Box,
  Drawer,
  Divider,
} from '@mui/material';
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
  transportationType: 'FLIGHT' | 'OTHER';
  originLocationName: string;
  destinationLocationName: string;
}

interface Route {
  beforeFlight: Transportation | null;
  flight: Transportation;
  afterFlight: Transportation | null;
  totalStops: number;
  totalDuration: number;
  totalPrice: number;
}

interface ValidationError {
  code: string;
  message: string;
}

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchParams, setSearchParams] = useState({
    originLocationId: '',
    destinationLocationId: '',
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateSearchParams = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Required fields validation
    if (!searchParams.originLocationId) {
      errors.push({
        code: 'ORIGIN_REQUIRED',
        message: 'Origin location is required'
      });
    }

    if (!searchParams.destinationLocationId) {
      errors.push({
        code: 'DESTINATION_REQUIRED',
        message: 'Destination location is required'
      });
    }

    // Same location validation
    if (searchParams.originLocationId && searchParams.destinationLocationId && 
        searchParams.originLocationId === searchParams.destinationLocationId) {
      errors.push({
        code: 'SAME_LOCATION',
        message: 'Origin and destination cannot be the same location'
      });
    }

    return errors;
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get<Location[]>('/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const searchRoutes = async () => {
    const errors = validateSearchParams();
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    try {
      const response = await api.post<Route[]>('/routes/search', {
        originLocationId: parseInt(searchParams.originLocationId),
        destinationLocationId: parseInt(searchParams.destinationLocationId),
      });
      setRoutes(response.data);
    } catch (error: any) {
      console.error('Error searching routes:', error);
      if (error.response?.data?.message) {
        setValidationErrors([{
          code: 'API_ERROR',
          message: error.response.data.message
        }]);
      } else {
        setValidationErrors([{
          code: 'API_ERROR',
          message: 'An error occurred while searching routes'
        }]);
      }
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRoutes();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
    // Clear validation errors when user makes changes
    setValidationErrors([]);
  };

  const validateRoute = (route: Route): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Check if there is exactly one flight
    const transportations = [
      route.beforeFlight,
      route.flight,
      route.afterFlight
    ].filter(t => t !== null) as Transportation[];

    const flightCount = transportations.filter(t => t.transportationType === 'FLIGHT').length;
    if (flightCount !== 1) {
      errors.push({
        code: 'FLIGHT_REQUIREMENT',
        message: `Route must contain exactly one flight, found: ${flightCount}`
      });
    }

    // Check transportation count
    if (transportations.length > 3) {
      errors.push({
        code: 'TRANSPORTATION_COUNT',
        message: `Route cannot have more than 3 transportations, found: ${transportations.length}`
      });
    }

    // Check transfer types
    const flightIndex = transportations.findIndex(t => t.transportationType === 'FLIGHT');
    if (flightIndex !== -1) {
      // Check before flight transfers
      const beforeFlightTransfers = transportations.slice(0, flightIndex);
      if (beforeFlightTransfers.length > 1) {
        errors.push({
          code: 'MULTIPLE_BEFORE_TRANSFERS',
          message: 'Multiple before flight transfers are not allowed'
        });
      }
      if (beforeFlightTransfers.some(t => t.transportationType !== 'OTHER')) {
        errors.push({
          code: 'INVALID_BEFORE_TRANSFER_TYPE',
          message: 'Only OTHER type transportations are allowed before flight'
        });
      }

      // Check after flight transfers
      const afterFlightTransfers = transportations.slice(flightIndex + 1);
      if (afterFlightTransfers.length > 1) {
        errors.push({
          code: 'MULTIPLE_AFTER_TRANSFERS',
          message: 'Multiple after flight transfers are not allowed'
        });
      }
      if (afterFlightTransfers.some(t => t.transportationType !== 'OTHER')) {
        errors.push({
          code: 'INVALID_AFTER_TRANSFER_TYPE',
          message: 'Only OTHER type transportations are allowed after flight'
        });
      }
    }

    // Check connections
    for (let i = 0; i < transportations.length - 1; i++) {
      const current = transportations[i];
      const next = transportations[i + 1];
      if (current.destinationLocationId !== next.originLocationId) {
        errors.push({
          code: 'INVALID_CONNECTION',
          message: `Invalid connection between transportations: destination location ${current.destinationLocationId} does not match origin location ${next.originLocationId}`
        });
      }
    }

    return errors;
  };

  const handleRouteClick = (route: Route) => {
    const errors = validateRoute(route);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setSelectedRoute(route);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              Search Routes
            </Typography>
            <form onSubmit={handleSearch}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {validationErrors.map((error, index) => (
                    <Typography key={index} color="error" sx={{ mb: 2 }}>
                      {error.message}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    select
                    fullWidth
                    label="Origin"
                    name="originLocationId"
                    value={searchParams.originLocationId}
                    onChange={handleChange}
                    required
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    select
                    fullWidth
                    label="Destination"
                    name="destinationLocationId"
                    value={searchParams.destinationLocationId}
                    onChange={handleChange}
                    required
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ height: '56px' }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Available Routes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Source</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell>Stops</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow
                      key={route.flight.id}
                      hover
                      onClick={() => handleRouteClick(route)}
                      sx={{ cursor: 'pointer' }}
                      selected={selectedRoute?.flight.id === route.flight.id}
                    >
                      <TableCell>{route.flight.originLocationName}</TableCell>
                      <TableCell>{route.flight.destinationLocationName}</TableCell>
                      <TableCell>{route.totalStops === 0 ? 'Direct' : `${route.totalStops} stops`}</TableCell>
                      <TableCell>{route.totalDuration} hours</TableCell>
                      <TableCell>${route.totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={!!selectedRoute}
        onClose={() => {
          setSelectedRoute(null);
          setValidationErrors([]);
        }}
        sx={{ '& .MuiDrawer-paper': { width: '400px' } }}
      >
        <Box sx={{ p: 3 }}>
          {validationErrors.length > 0 ? (
            <>
              <Typography variant="h6" color="error" gutterBottom>
                Route Validation Errors
              </Typography>
              {validationErrors.map((error, index) => (
                <Typography key={index} color="error" sx={{ mb: 1 }}>
                  • {error.message}
                </Typography>
              ))}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  setValidationErrors([]);
                  setSelectedRoute(null);
                }}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </>
          ) : selectedRoute && (
            <>
              <Typography variant="h6" gutterBottom>
                Route Details
              </Typography>
              {selectedRoute.beforeFlight && (
                <>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    First Leg:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    From: {selectedRoute.beforeFlight.originLocationName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    To: {selectedRoute.beforeFlight.destinationLocationName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Type: {selectedRoute.beforeFlight.transportationType}
                  </Typography>
                </>
              )}
              <Typography variant="subtitle1" color="primary" gutterBottom>
                {selectedRoute.beforeFlight ? 'Main Flight:' : 'Flight:'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                From: {selectedRoute.flight.originLocationName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                To: {selectedRoute.flight.destinationLocationName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Type: {selectedRoute.flight.transportationType}
              </Typography>
              {selectedRoute.afterFlight && (
                <>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Last Leg:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    From: {selectedRoute.afterFlight.originLocationName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    To: {selectedRoute.afterFlight.destinationLocationName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Type: {selectedRoute.afterFlight.transportationType}
                  </Typography>
                </>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Total Stops: {selectedRoute.totalStops}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Total Duration: {selectedRoute.totalDuration} hours
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Total Price: ${selectedRoute.totalPrice.toFixed(2)}
              </Typography>
            </>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default RoutesPage; 