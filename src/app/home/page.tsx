"use client";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  TextField,
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
}

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleModal = () => setModalOpen(!modalOpen);

  interface OpenLibraryDoc {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
  }

  const searchBooks = async (term: string) => {
    if (!term) return;

    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(term)}`
    );
    const data = await res.json();

    const books = (data.docs as OpenLibraryDoc[]).map((item) => ({
      id: item.key,
      title: item.title,
      authors: item.author_name || [],
      thumbnail: item.cover_i
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : "",
    }));

    setSearchResults(books);
  };

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      const res = await fetch("/api/books");
      const data = await res.json();
      setLibraryBooks(data);
    };
    fetchLibraryBooks();
  }, []);


  useEffect(() => {
    const timeout = setTimeout(() => {
      searchBooks(searchTerm);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const addBookToSelection = (book: Book) => {
    if (!selectedBooks.find((b) => b.id === book.id)) {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const handleSaveBooks = async () => {
    try {
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBooks),
      });

      setLibraryBooks([...libraryBooks, ...selectedBooks]);
      setSelectedBooks([]);
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save books:", err);
    }
  };


  return (
    <>
      {/* NAVIGATION */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Library
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SLIDING MENU */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItem onClick={toggleModal}>
            <ListItemText primary="Add Books" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Log Out" />
          </ListItem>
        </List>
      </Drawer>

      {/* ADD BOOKS MODAL */}
      <Modal open={modalOpen} onClose={toggleModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Search Books to Add
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Box mt={2}>
            <Grid container spacing={2}>
              {searchResults.map((book) => (
                <Grid key={book.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <Card
                    onClick={() => addBookToSelection(book)}
                    sx={{ cursor: "pointer", height: "100%" }}
                  >
                    {book.thumbnail && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={book.thumbnail}
                        alt={book.title}
                      />
                    )}
                    <CardContent>
                      <Typography variant="subtitle1">{book.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.authors.join(", ")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Badge badgeContent={selectedBooks.length} color="primary">
              <Typography>Selected Books</Typography>
            </Badge>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveBooks}
              disabled={selectedBooks.length === 0}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* MAIN PAGE CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {libraryBooks.length === 0 ? (
          <Typography align="center" variant="h5" mt={5}>
            You don&apos;t have any books yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {libraryBooks.map((book) => (
              <Grid key={book.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Card>
                  {book.thumbnail && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={book.thumbnail}
                      alt={book.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1">{book.title}</Typography>
                    <Typography variant="body2">
                      {book.authors.join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
