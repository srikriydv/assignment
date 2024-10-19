import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Card, Button, Col, Row } from 'antd';

const LandingPage = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*');

    if (error) console.error(error);
    else setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    const { data: postData, error: fetchError } = await supabase
      .from('posts')
      .select('like_count')
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error(fetchError);
      return;
    }

    const newLikeCount = postData.like_count + 1;

    const { error } = await supabase
      .from('posts')
      .update({ like_count: newLikeCount })
      .eq('id', postId);

    if (error) console.error(error);
    else fetchPosts();
  };

  const handleRepost = async (postId) => {
    const { data: postData, error: fetchError } = await supabase
      .from('posts')
      .select('repost_count')
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error(fetchError);
      return;
    }

    const newRepostCount = postData.repost_count + 1;

    const { error } = await supabase
      .from('posts')
      .update({ repost_count: newRepostCount })
      .eq('id', postId);

    if (error) console.error(error);
    else fetchPosts();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Posts</h1>
      <Row gutter={16}>
        {posts.map((post) => (
          <Col span={8} key={post.id} style={{ marginBottom: '16px' }}>
            <Card
              title={post.title}
              bordered={false}
              cover={post.image ? <img src={post.image} alt="Post" style={{ height: '200px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }} /> : null}
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
              }}
              hoverable
              bodyStyle={{ padding: '16px' }}
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ marginBottom: '16px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => handleLike(post.id)} type="primary">
                  Like ({post.like_count})
                </Button>
                <Button onClick={() => handleRepost(post.id)} type="default">
                  Repost ({post.repost_count})
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LandingPage;