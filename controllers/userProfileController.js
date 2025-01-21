export const getUserProfile = async (req, res) => {
    const { role } = req.params;
    const userId = req.user.id; // Assuming user ID is added by the `authenticate` middleware
  
    try {
      let profileData;
      switch (role) {
        case 'recruiter':
          profileData = await Recruiter.findById(userId); // Adjust model as per your DB schema
          break;
        case 'jobSeeker':
          profileData = await JobSeeker.findById(userId);
          break;
        case 'client':
          profileData = await Client.findById(userId);
          break;
        case 'developer':
          profileData = await Developer.findById(userId);
          break;
        case 'teacher':
          profileData = await Teacher.findById(userId);
          break;
        case 'student':
          profileData = await Student.findById(userId);
          break;
        default:
          return res.status(400).json({ message: 'Invalid role' });
      }
  
      if (!profileData) return res.status(404).json({ message: 'Profile not found' });
  
      res.status(200).json(profileData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error });
    }
  };
  