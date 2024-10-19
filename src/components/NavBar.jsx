import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button, Dropdown } from 'antd';
import { supabase } from '../utils/supabaseClient';
import { UserOutlined } from '@ant-design/icons';

const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user || null);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" disabled>
        {user?.email}
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0' }}>
      <Menu 
        mode="horizontal" 
        style={{ 
          background: 'linear-gradient(90deg, #ff6b6b, #f4d03f)', 
          border: 'none', 
          margin: '0', 
          height: '70px', 
          lineHeight: '70px' 
        }}
      >
        <Menu.Item key="home" style={{ fontSize: '18px' }}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="create" style={{ fontSize: '18px' }}>
          <Link to="/create">Create Post</Link>
        </Menu.Item>
        <Menu.Item key="docs" style={{ fontSize: '18px' }}>
          <Link to="/docs">Documentation</Link>
        </Menu.Item>
        <Menu.Item key="auth" style={{ float: 'right', marginLeft: 'auto', fontSize: '18px' }}>
          {user ? (
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Button 
                icon={<UserOutlined />} 
                type="primary" 
                style={{ marginLeft: 10, fontSize: '16px' }} 
              >
                {user.email}
              </Button>
            </Dropdown>
          ) : (
            <Button onClick={handleLogin} type="primary" style={{ fontSize: '16px' }}>
              Login with Google
            </Button>
          )}
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default NavBar;