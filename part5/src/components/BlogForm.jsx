import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
} from "@mui/material";

const BlogForm = ({
  onSubmit,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => {
  return (
    <Box sx={{ marginTop: 2, marginBottom: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create new blog
      </Typography>

      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={handleTitleChange}
            fullWidth
            required
          />
          <TextField
            label="Author"
            value={author}
            onChange={handleAuthorChange}
            fullWidth
          />
          <TextField
            label="URL"
            value={url}
            onChange={handleUrlChange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default BlogForm
