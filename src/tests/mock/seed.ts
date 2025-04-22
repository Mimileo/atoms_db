import connectToDatabase from '../../config/database';
import User from '../../models/Users';
import Course from '../../models/Course';
import Enrollment from '../../models/Enrollment';

export async function seedDatabase() {
  await connectToDatabase();

  const existingUser1 = await User.findOne({ email: 'ally@example.com' });
  const existingUser2 = await User.findOne({ email: 'user2@example.com' });
  const existingCourse1 = await Course.findOne({ title: 'Intro to C++' });
  const existingCourse2 = await Course.findOne({ title: 'Advanced C++' });

  if (existingUser1 || existingUser2 || existingCourse1 || existingCourse2) {
    await User.deleteMany({ email: { $in: ['ally@example.com', 'user2@example.com'] } });
    await Course.deleteMany({ title: { $in: ['Intro to C++', 'Advanced C++'] } });
  }
  const user1 = await User.create({
    firstName: 'Ally',
    lastName: 'Smith',
    username: 'user1',
    email: 'ally@example.com',
    password: 'secure123',
    dob: new Date('2000-01-01'),
    class: '10A',
    schoolName: 'Greenwood High',
  });
  
  const user2 = await User.create({
    firstName: 'Bob',
    lastName: 'Johnson',
    username: 'user2',
    email: 'user2@example.com',
    password: 'secure456',
    dob: new Date('2001-02-02'),
    class: '10B',
    schoolName: 'Maple Leaf School',
  });

  const course1 = await Course.create({
    title: 'Intro to C++',
    description: 'C++ for beginners.',
    instructorId: user1._id,
  });
  
  const course2 = await Course.create({
    title: 'Advanced C++',
    description: 'Deep dive into C++.',
    instructorId: user2._id,
  });
  
  await Enrollment.create({ userId: user1._id, courseId: course1._id, role: 'student', status: 'active' });
  await Enrollment.create({ userId: user2._id, courseId: course1._id, role: 'student', status: 'active' });
  await Enrollment.create({ userId: user1._id, courseId: course2._id, role: 'student', status: 'active' });

  return { user1, user2, course1, course2 };
}
