import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Card, CardMedia, CardContent, AppBar, Toolbar, IconButton, Box, CircularProgress, Fab } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ImageSearch = () => {
  const [query, setQuery] = useState('tech'); // Default search term set to 'tech'
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // For loading spinner
  const [page, setPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(0);
  
  const UNSPLASH_ACCESS_KEY = 'zrffpLrdT1DPotR43_6A2OzZ_Om7dTek4Zgup8WIwHE';

  const suggestions = ['nature', 'cars', 'technology', 'art', 'animals', 'travel']; // Suggested search terms

  useEffect(() => {
    // Fetch images when component mounts with default query 'tech'
    searchImages();
  }, [page]);

  const searchImages = async (e) => {
    if (e) e.preventDefault();

    setLoading(true); // Show loading spinner

    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query, page, per_page: 12 },
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      });
      setImages(response.data.results);
      setTotalPages(response.data.total_pages); // Set total pages for pagination
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false); // Hide loading spinner after data fetch
    }
  };

  const handleRefresh = () => {
    setQuery('tech');
    searchImages();
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && page < totalPages) {
      setPage(page + 1);
    } else if (direction === 'prev' && page > 1) {
      setPage(page - 1);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box sx={{ backgroundColor: '#1E1E1E', minHeight: '100vh', width: '98vw', overflowX: 'hidden', position: 'relative' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ backgroundColor: '#333', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
          <form onSubmit={searchImages} style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <TextField
              variant="outlined"
              placeholder="Search images"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{ style: { color: 'white' } }} // White input text
              sx={{
                backgroundColor: '#444',
                borderRadius: '5px',
                input: { color: 'white' },
              }}
              fullWidth
            />
            <IconButton type="submit" color="inherit">
              <SearchIcon />
            </IconButton>
          </form>
        </Toolbar>
      </AppBar>

      {/* Suggested Names - Floating Window */}
      <Box sx={{
        position: 'fixed',
        top: '10%',
        left: '10px',
        height: '500px',
        width:"150px",
        display:"flex",
        flexDirection:"column",
        alignItems:"flex-start",
        backgroundColor: '#444',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: 999,
        paddingLeft:7,
        gap:2
        
      }}>
        <h4 style={{ color: 'white', marginBottom: '10px' }}>Suggestions:</h4>
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="text"
            sx={{ color: 'white', textTransform: 'capitalize',background: 'rgba(0,0,0,0.2)', marginBottom: '5px',width:"100px" }}
            onClick={() => {
              setQuery(suggestion);
              searchImages();
            }}
          >
            {suggestion}
          </Button>
        ))}
      </Box>

      {/* Loading Spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {/* Image Display */}
      {!loading && (
        <Container sx={{ marginTop: '80px',marginLeft:30, display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-evenly', widows: "100%" }}>
          {images.length > 0 ? (
            images.map((image) => (
              <Card
                key={image.id}
                sx={{
                  margin: '10px',
                  width: '350px',
                  height:"300px",
                  backgroundColor: '#2E2E2E',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  '&:hover': { transform: 'scale(1.05)', transition: '0.3s ease-in-out' },
                }}
              >
                <CardMedia
                  component="img"
                  image={image.urls.small}
                  alt={image.alt_description || 'Unsplash Image'}
                  sx={{ height: '200px', objectFit: 'cover' }}
                />
                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    href={image.links.download}
                    download={image.id+'.jpg'}
                    sx={{ backgroundColor: '#FF5722', '&:hover': { backgroundColor: '#FF7043' } }}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p style={{ color: 'white' }}>No images found. Try a different search.</p>
          )}
        </Container>
      )}

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', paddingBottom: '20px' }}>
        <Button
          onClick={() => handlePageChange('prev')}
          disabled={page === 1}
          sx={{ marginRight: '10px', backgroundColor: '#444', color: 'white' }}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange('next')}
          disabled={page === totalPages}
          sx={{ backgroundColor: '#444', color: 'white' }}
        >
          Next
        </Button>
      </Box>

      {/* Back to Top Button */}
      <Fab
        color="secondary"
        aria-label="back to top"
        onClick={scrollToTop}
        sx={{ position: 'fixed', bottom: '20px', right: '20px' }}
      >
        <ArrowUpwardIcon />
      </Fab>
    </Box>
  );
};

export default ImageSearch;
