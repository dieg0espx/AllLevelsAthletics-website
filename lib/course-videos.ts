// Course Video Links
// All video URLs for the course content

export const courseVideos = [
  {
    id: 1,
    title: "Part 1",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642940/Part1_awkyey.mp4"
  },
  {
    id: 2,
    title: "Part 2", 
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642437/Part2_acfl9i.mp4"
  },
  {
    id: 3,
    title: "Part 3",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642924/Part3_iaes4w.mp4"
  },
  {
    id: 4,
    title: "Part 4",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642939/Part4_h1twbp.mp4"
  },
  {
    id: 5,
    title: "Part 5",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642437/Part5_jyq2nq.mp4"
  },
  {
    id: 6,
    title: "Part 6",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758643264/Part6_uzfmcg.mp4"
  },
  {
    id: 7,
    title: "Part 7",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642455/Part7_owfbnq.mp4"
  },
  {
    id: 8,
    title: "Part 8",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642929/Part8_jpwkpz.mp4"
  },
  {
    id: 9,
    title: "Part 9",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642438/Part9_mye0wd.mp4"
  },
  {
    id: 10,
    title: "Part 10",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642433/Part10_yamrzz.mp4"
  },
  {
    id: 11,
    title: "Part 11",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642922/Part11_znxrlj.mp4"
  },
  {
    id: 12,
    title: "Part 12",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642417/Part12_voi7rs.mp4"
  },
  {
    id: 13,
    title: "Part 13",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642939/Part13_zpkbhy.mp4"
  },
  {
    id: 14,
    title: "Part 14",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642947/Part14_vvqri4.mp4"
  },
  {
    id: 15,
    title: "Part 15",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642947/Part15_kgumek.mp4"
  },
  {
    id: 16,
    title: "Part 16",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642598/Part16_ez3mrn.mp4"
  },
  {
    id: 17,
    title: "Part 17",
    url: "https://res.cloudinary.com/dhuhpf3wq/video/upload/v1758642929/Part17_bx89es.mp4"
  },
  {
    id: 18,
    title: "Part 18",
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
  url: string;
}
