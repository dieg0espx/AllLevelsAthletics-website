// Course Video Links
// All video URLs for the course content

export const courseVideos = [
  {
    id: 1,
    title: "Introduction",
    subtitle: "Welcome to the Tension Release Program",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642940/Part1_awkyey.mp4"
  },
  {
    id: 2,
    title: "Glutes", 
    subtitle: "Preferred tool: Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642437/Part2_acfl9i.mp4"
  },
  {
    id: 3,
    title: "Low Back",
    subtitle: "Preferred tool: Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642924/Part3_iaes4w.mp4"
  },
  {
    id: 4,
    title: "Mid Back",
    subtitle: "Preferred tool: Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642939/Part4_h1twbp.mp4"
  },
  {
    id: 5,
    title: "TFL Cintural Rotate",
    subtitle: "Preferred tool: MFRoller or Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642437/Part5_jyq2nq.mp4"
  },
  {
    id: 6,
    title: "Hip Flexor",
    subtitle: "Preferred tool: MFRoller",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758643264/Part6_uzfmcg.mp4"
  },
  {
    id: 7,
    title: "Quad",
    subtitle: "Preferred tool: MFRoller (or Foam Roller if too painful)",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642455/Part7_owfbnq.mp4"
  },
  {
    id: 8,
    title: "VMO",
    subtitle: "Preferred tool: Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642929/Part8_jpwkpz.mp4"
  },
  {
    id: 9,
    title: "Hamstring",
    subtitle: "Preferred tool: MFRoller or Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642438/Part9_mye0wd.mp4"
  },
  {
    id: 10,
    title: "Abductors",
    subtitle: "Preferred tool: Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642433/Part10_yamrzz.mp4"
  },
  {
    id: 11,
    title: "Adductors",
    subtitle: "Preferred tool: MFRoller",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642922/Part11_znxrlj.mp4"
  },
  {
    id: 12,
    title: "Tibialis",
    subtitle: "Preferred tool: Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642417/Part12_voi7rs.mp4"
  },
  {
    id: 13,
    title: "Gastrocnemius",
    subtitle: "Preferred tool: MFRoller",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642939/Part13_zpkbhy.mp4"
  },
  {
    id: 14,
    title: "Soleus",
    subtitle: "Preferred tool: MFRoller",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642947/Part14_vvqri4.mp4"
  },
  {
    id: 15,
    title: "Foot",
    subtitle: "Preferred tool: MFRoller or Lacrosse Ball",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642947/Part15_kgumek.mp4"
  },
  {
    id: 16,
    title: "Recovery & Integration",
    subtitle: "Putting it all together",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642598/Part16_ez3mrn.mp4"
  },
  {
    id: 17,
    title: "The Big Picture",
    subtitle: "How tension release, stretching, activation, and compound reintegration work together",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642929/Part17_bx89es.mp4"
  },
  {
    id: 18,
    title: "Thank You",
    subtitle: "Congratulations on completing the program!",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642829/Part18_zavg6z.mp4"
  }
];

// Helper function to get video by ID
export const getVideoById = (id: number) => {
  return courseVideos.find(video => video.id === id);
};

// Helper function to get all video URLs as array
export const getAllVideoUrls = () => {
  return courseVideos.map(video => video.url);
};

// Type definition for course video
export interface CourseVideo {
  id: number;
  title: string;
  subtitle: string;
  url: string;
}
