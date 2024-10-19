import React, { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { supabase } from '../utils/supabaseClient';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (values) => {
    const { title, content } = values;
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content, image }]);

    if (error) {
      message.error('Error creating post. Please try again.'); 
      console.error(error);
    } else {
      message.success('Post created successfully!'); 
      setTitle('');
      setContent('');
      setImage('');
    }
  };

  return (
    <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
      <Form 
        onFinish={handleSubmit} 
        style={{ 
          maxWidth: '600px', 
          width: '100%', 
          padding: '30px', 
          background: '#ffffff', 
          borderRadius: '8px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Create a New Post</h2>
        <Form.Item 
          name="title" 
          rules={[{ required: true, message: 'Please input your title!' }]}
        >
          <Input 
            placeholder="Post Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </Form.Item>
        <Form.Item 
          name="content" 
          rules={[{ required: true, message: 'Please input your content!' }]}
        >
          <Input.TextArea 
            placeholder="Post Content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
        </Form.Item>
        <Form.Item name="image">
          <Input 
            placeholder="Image URL (optional)" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Post
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePost;