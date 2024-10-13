import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getStats = catchAsync(async (req, res) => {
  const startDate = req.query.date;
  const today = new Date().toISOString();

  const students = await User.aggregate([
    {
      $match: {
        active: { $eq: true },
        role: { $eq: 'student' },
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(today),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
      },
    },
  ]);

  const transaction = await User.aggregate([
    {
      $lookup: {
        from: 'transactions',
        localField: '_id',
        foreignField: 'userId',
        as: 'transactions',
      },
    },
    {
      $unwind: {
        path: '$transactions',
        preserveNullAndEmptyArrays: true, // Include students with no transactions
      },
    },
    {
      $match: {
        'transactions.createdAt': {
          $gte: new Date(startDate),
          $lt: new Date(today),
        },
      },
    },
    {
      $group: {
        _id: null, // Group all students together
        totalFees: { $sum: '$totalFees' }, // Sum of all students' total fees
        totalDeposited: { $sum: '$transactions.transactionAmount' }, // Sum of all deposits in the date range
        totalTransaction: { $sum: 1 },
      },
    },
    {
      $project: {
        totalFees: 1,
        totalDeposited: 1,
        totalTransaction: 1,
        depositRate: {
          $round: {
            $multiply: [{ $divide: ['$totalDeposited', '$totalFees'] }, 100],
          },
        },
      },
    },
  ]);

  const allTransactions = await Transaction.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lt: new Date(today) }, // Filter transactions by date
      },
    },
    {
      $lookup: {
        from: 'courses', // Join with the courses collection
        localField: 'courses', // Field in the transactions document (array of courseId)
        foreignField: '_id', // Field in the courses document (course _id)
        as: 'courseDetails', // Store the joined course documents in this field
      },
    },
    {
      $project: {
        _id: 1, // Include transaction _id
        transactionAmount: 1, // Include transaction amount
        transactionDate: 1, // Include transaction date
        courses: '$courseDetails', // Rename the joined courses array to "courses"
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: 1 },
    },
  ]);

  const lastTransactions = await Transaction.find()
    .sort({ _id: -1 })
    .limit(5)
    .populate({
      path: 'courses',
      select: 'courseName',
    })
    .populate({
      path: 'userId',
      select: 'name',
    });

  const popularCourses = await User.aggregate([
    // Step 1: Unwind the 'courses' array in 'users' collection
    {
      $unwind: '$courses',
    },

    // Step 2: Lookup to join the 'courses' collection using the course reference id
    {
      $lookup: {
        from: 'courses', // 'courses' collection to join
        localField: 'courses', // Field in 'users' that holds course references
        foreignField: '_id', // Field in 'courses' that holds course IDs
        as: 'courseDetails', // Output array field for course details
      },
    },

    // Step 3: Unwind the 'courseDetails' array (since we expect only one course per reference)
    {
      $unwind: '$courseDetails',
    },

    // Step 4: Group by course ID and count total users who have selected the course
    {
      $group: {
        _id: '$courseDetails._id', // Group by course ID
        courseName: { $first: '$courseDetails.courseName' }, // Include course name
        userCount: { $sum: 1 }, // Count the number of users
      },
    },

    // Step 5: Sort the results by userCount in descending order
    {
      $sort: { userCount: -1 },
    },

    // Step 6: Project the desired output fields (optional)
    {
      $project: {
        _id: 1,
        courseName: 1,
        userCount: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    stats: {
      students,
      transaction,
      allTransactions,
      lastTransactions,
      popularCourses,
    },
  });
});
