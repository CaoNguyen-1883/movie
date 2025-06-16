import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '@/config/database';
import Genre from '@/models/genre.model';

dotenv.config();

const genresToSeed = [
  { name: 'Action', description: 'High-energy films featuring physical stunts, extended fight scenes, and chases.' },
  { name: 'Adventure', description: 'Films that feature journeys, exploration, and the overcoming of obstacles.' },
  { name: 'Animation', description: 'Films created using animation techniques.' },
  { name: 'Comedy', description: 'Light-hearted films designed to make the audience laugh.' },
  { name: 'Crime', description: 'Films that focus on the lives of criminals or the investigation of crimes.' },
  { name: 'Documentary', description: 'Non-fictional motion pictures intended to document reality.' },
  { name: 'Drama', description: 'Serious, plot-driven presentations, portraying realistic characters and settings.' },
  { name: 'Family', description: 'Films suitable for all ages.' },
  { name: 'Fantasy', description: 'Films with fantastic themes, usually involving magic, supernatural events, or exotic fantasy worlds.' },
  { name: 'History', description: 'Films that are based on historical events.' },
  { name: 'Horror', description: 'Films that seek to elicit fear or disgust.' },
  { name: 'Music', description: 'Films in which songs are interwoven into the narrative.' },
  { name: 'Mystery', description: 'Films that revolve around the solution of a puzzle or a crime.' },
  { name: 'Romance', description: 'Films that focus on passion, emotion, and the affectionate romantic involvement of the main characters.' },
  { name: 'Science Fiction', description: 'Films based on speculative, fictional science-based depictions of phenomena.' },
  { name: 'TV Movie', description: 'Feature-length motion pictures produced for television broadcast.' },
  { name: 'Thriller', description: 'Films that evoke excitement and suspense in the audience.' },
  { name: 'War', description: 'Films concerned with warfare, typically about naval, air, or land battles.' },
  { name: 'Western', description: 'Films set in the American West that embody the spirit, struggle, and demise of the new frontier.' },
];

const seedGenres = async () => {
  console.log('Connecting to database...');
  await connectDB();
  console.log('Database connected.');

  try {
    console.log('Seeding genres...');

    for (const g of genresToSeed) {
      await Genre.findOneAndUpdate({ name: g.name }, g, { upsert: true, new: true });
      console.log(`- Upserted genre: ${g.name}`);
    }

    console.log('✅ Genres seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding genres:', error);
    process.exit(1);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedGenres(); 