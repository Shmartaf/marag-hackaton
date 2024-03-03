import { useState, useEffect } from 'react';
import { getAll, delet } from '../service';
import { Container, Typography, CircularProgress } from '@mui/material';
import List from './List';
import Grid from '@mui/material/Grid';

const ListInventory = () => {
  const [supplies, setSupplies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Initial state:', { supplies, searchTerm, selectedSupply, loading, error });

  const fetchSupplies = async () => {
    console.log('Fetching supplies...');
    try {
      const response = await getAll();
      console.log('Response:', response);
      if (response.error) {
        setError(response.error);
      }
      setSupplies(response);
    } catch (error) {
      console.error('Failed to fetch supplies:', error);
      setError(error.message || 'An error occurred while fetching supplies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  console.log('State after useEffect:', { supplies, searchTerm, selectedSupply, loading, error });

  const removeSupply = async (supply) => {
    console.log('Removing supply:', supply);
    try {
      await delet(supply.name);
    } catch (error) {
      console.error("Failed to delete supply:", error);
      setError(error.message || "An error occurred while deleting the supply.");
    }
  };

  console.log('Rendering component with state:', { supplies, searchTerm, selectedSupply, loading, error });

  return (
    <Container>
      <Grid container justifyContent="space-between">
        {/* ... (previous code) */}
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      ) : (
        <List
          supplies={supplies.filter((supply) =>
            supply.name && supply.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )}
          onEdit={setSelectedSupply}
          onDelete={removeSupply}
          fetchSupplies={fetchSupplies}
        />
      )}
      {/* ... (remaining code) */}
    </Container>
  );
};

export default ListInventory;