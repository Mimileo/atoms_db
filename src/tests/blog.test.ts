import mongoose from 'mongoose';
import connectToDatabase from '../config/database';
import BlogPost from '../models/BlogPost';

describe('BlogPost model', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clean up after each test
    await BlogPost.deleteMany({ title: { $in: ['Learn MongoDB with Mongoose', 'Advanced JavaScript Tips', 'CSS Grid Layout', 'React Hooks Introduction'] } });
  });

  it('should create a blog post', async () => {
    const blogPost = await BlogPost.create({
      title: 'Learn MongoDB with Mongoose',
      content: 'This blog post is about MongoDB and Mongoose integration.',
      courseId: new mongoose.Types.ObjectId(),
      stepId: new mongoose.Types.ObjectId(),
      lectureId: new mongoose.Types.ObjectId(),
      isPublished: true
    });

    expect(blogPost).toBeDefined();
    expect(blogPost.title).toBe('Learn MongoDB with Mongoose');
  });

  it('should retrieve a blog post by ID', async () => {
    const blogPost = await BlogPost.create({
      title: 'Advanced JavaScript Tips',
      content: 'This blog post contains advanced JS tips.',
      courseId: new mongoose.Types.ObjectId(),
      stepId: new mongoose.Types.ObjectId(),
      lectureId: new mongoose.Types.ObjectId(),
      isPublished: true
    });

    const foundBlogPost = await BlogPost.findById(blogPost._id);
    expect(foundBlogPost).toBeDefined();
    expect(foundBlogPost?.title).toBe('Advanced JavaScript Tips');
  });

  it('should update a blog post', async () => {
    const blogPost = await BlogPost.create({
      title: 'CSS Grid Layout',
      content: 'This blog post is about CSS Grid.',
      courseId: new mongoose.Types.ObjectId(),
      stepId: new mongoose.Types.ObjectId(),
      lectureId: new mongoose.Types.ObjectId(),
      isPublished: false
    });

    // Simulate update operation
    blogPost.title = 'Updated CSS Grid Layout';
    await blogPost.save(); // Ensure to save after modifying the blog post

    const updatedBlogPost = await BlogPost.findById(blogPost._id);
    expect(updatedBlogPost?.title).toBe('Updated CSS Grid Layout');
  });

  it('should delete a blog post', async () => {
    const blogPost = await BlogPost.create({
      title: 'React Hooks Introduction',
      content: 'Learn about React Hooks.',
      courseId: new mongoose.Types.ObjectId(),
      stepId: new mongoose.Types.ObjectId(),
      lectureId: new mongoose.Types.ObjectId(),
      isPublished: true
    });

    await BlogPost.findByIdAndDelete(blogPost._id);

    const deletedBlogPost = await BlogPost.findById(blogPost._id);
    expect(deletedBlogPost).toBeNull();
  });
});
