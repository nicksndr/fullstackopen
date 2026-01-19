import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";

const UserInformation = ({ blogs }) => {
  const userBlogCounts = Object.values(
    blogs.reduce((acc, blog) => {
      if (!blog.user) {
        return acc;
      }

      const id = blog.user.id;
      // If user not yet seen, initialize
      if (!acc[id]) {
        acc[id] = {
          id: blog.user.id,
          name: blog.user.name,
          blogs: 0,
        };
      }

      // Increment that user's blog count
      acc[id].blogs += 1;
      return acc;
    }, {})
  );
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Blogs created</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userBlogCounts.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Link
                    to={`/users/${user.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell align="right">{user.blogs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserInformation;
