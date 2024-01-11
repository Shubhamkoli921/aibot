import React, { useState, useEffect } from 'react';
const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    names: '',
    business_name: '',
    logo: '',
    email: '',
    phone: '',
    city: '',
    pincode: '',
    password: '',
    enabled: true,
  });
  const [updatingAdminId, setUpdatingAdminId] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5000/admins')
      .then((response) => response.json())
      .then((data) => setAdmins(data.admins))
      .catch((error) => console.error('Error fetching admins:', error));

  }, []); // Empty dependency array, so it runs only once
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAddAdmin = () => {
    fetch('http://localhost:5000/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        // After adding, fetch the updated list of admins
        fetch('http://localhost:5000/admins')
          .then((response) => response.json())
          .then((data) => setAdmins(data.admins))
          .catch((error) => console.error('Error fetching admins:', error));
      })
      .catch((error) => console.error('Error adding admin:', error));
  };
  const handleDeleteAdmin = (adminId) => {
    fetch(`http://localhost:5000/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(() => {
        // After deleting, fetch the updated list of admins
        fetch('http://localhost:5000/admins')
          .then((response) => response.json())
          .then((data) => setAdmins(data.admins))
          .catch((error) => console.error('Error fetching admins:', error));
      })
      .catch((error) => console.error('Error deleting admin:', error));
  };
  const handleUpdateAdmin = (adminId) => {
    // Fetch the details of the admin to be updated
    fetch(`http://localhost:5000/admins/${adminId}`)
      .then((response) => {
        
        response.json()
        console.log("showing response>>>>>",response);
    })
    //   console.log("");
      .then((data) => {
        setFormData(data);
        setUpdatingAdminId(data.adminId);
        console.log("show me data>>>>",data)
      })
      .catch((error) => console.error('Error fetching admin details:', error));
  };
  const handleSaveUpdate = () => {
    // Update the admin details
    fetch(`http://localhost:5000/admins/${updatingAdminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(() => {
        // After updating, fetch the updated list of admins
        fetch('http://localhost:5000/admins')
          .then((response) => response.json())
          .then((data) => setAdmins(data.admins))
          .catch((error) => console.error('Error fetching admins:', error));
        setFormData({
          names: '',
          business_name: '',
          logo: '',
          email: '',
          phone: '',
          city: '',
          pincode: '',
          password: '',
          enabled: true,
        });
        setUpdatingAdminId(null);
      })
      .catch((error) => console.error('Error updating admin:', error));
  };
  return (
    <div>
      <h2>Admin Users</h2>
      <ul>
        {admins.map((admin) => (
          <li key={admin._id}>
            {admin.names}
            {admin.business_name}
            {admin.logo}
            {admin.email}
            {admin.phone}
            {admin.city}
            {admin.pincode}
            
            <button onClick={() => handleDeleteAdmin(admin._id)}>Delete</button>
            <button onClick={() => handleUpdateAdmin(admin._id)}>Update</button>
          </li>
        ))}
      </ul>
      <h2>{updatingAdminId ? 'Update Admin' : 'Add Admin'}</h2>
      <form>
        {/* Include input fields for other admin properties as well */}
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <label>
          business_name:
          <input type="text" name="business_name" value={formData.business_name} onChange={handleInputChange} />
        </label>
        <label>
          logo:
          <input type="text" name="logo" value={formData.logo} onChange={handleInputChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
        </label>
        <label>
          phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
        </label>
        <label>
          city:
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
        </label>
        <label>
          pincode:
          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} />
        </label>
        {/* Include input fields for other admin properties as well */}
        {updatingAdminId ? (
          <button type="button" onClick={handleSaveUpdate}>
            Save Update
          </button>
        ) : (
          <button type="button" onClick={handleAddAdmin}>
            Add Admin
          </button>
        )}
      </form>
    </div>
  );
};
export default AdminList;