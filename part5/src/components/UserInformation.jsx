import { Link } from "react-router-dom";

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
    <div>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {userBlogCounts.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserInformation;
