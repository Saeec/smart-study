// backend/Controllers/DashboardController.js

const Session = require('../Models/Session');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // --- Data for Subject Pie Chart (total time per subject in minutes) ---
        const subjectData = await Session.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$subject', totalDuration: { $sum: '$duration' } } },
            { $project: { name: '$_id', value: '$totalDuration', _id: 0 } }
        ]);

        const subjectPieChartData = subjectData.map(item => ({
            ...item,
            value: Math.floor(item.value / 60) // Keep pie chart in minutes for better detail
        }));

        // --- Data for Weekly Bar Chart (Monday to Sunday in hours) ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startOfWeek.setDate(today.getDate() - daysToSubtract);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const weeklyData = await Session.aggregate([
            { $match: { user: userId, createdAt: { $gte: startOfWeek, $lt: endOfWeek } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalDuration: { $sum: '$duration' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
        
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyBarChartData = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            const dateString = currentDate.toISOString().split('T')[0];

            const dayData = weeklyData.find(d => d._id === dateString);
            
            weeklyBarChartData.push({
                name: days[i],
                // --- CHANGE IS HERE ---
                hours: dayData ? parseFloat((dayData.totalDuration / 3600).toFixed(2)) : 0
            });
        }

        res.status(200).json({ subjectPieChartData, weeklyBarChartData });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: 'Error fetching dashboard stats', error });
    }
};
