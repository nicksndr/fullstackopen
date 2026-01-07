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
        <tr>
          <th>Name</th>
          <th>Blogs created</th>
        </tr>
        {userBlogCounts.map((user) => (
          <tr>
            <td>{user.name}</td>
            <td>{user.blogs}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default UserInformation;
