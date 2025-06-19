import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import slugify from 'slugify';

import connectDB from '@/config/database';
import Movie from '@/models/movie.model';
// import Genre from '@/models/genre.model';
// import Person from '@/models/person.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const movies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseDate: new Date('2010-07-16T00:00:00.000Z'),
    duration: 148,
    posterUrl: 'https://m.media-amazon.com/images/I/912AErFSBHL._AC_UF1000,1000_QL80_.jpg',
    backdropUrls: [
      'https://image.tmdb.org/t/p/original/s3TBrA1J7dCj4uBqXoWCMYUTL5A.jpg',
      'https://image.tmdb.org/t/p/original/4I22h244i4aLzS5gYn42aAd1Jry.jpg',
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    status: 'RELEASED',
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseDate: new Date('2008-07-18T00:00:00.000Z'),
    duration: 152,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
    backdropUrls: [
      'https://image.tmdb.org/t/p/original/nMKdUUQBECcEBUACzQq1MM1r7vV.jpg',
      'https://image.tmdb.org/t/p/original/kk985i3i2g5B4a5s1F3b1aT2Hth.jpg',
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    status: 'RELEASED',
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    releaseDate: new Date('2024-03-01T00:00:00.000Z'),
    duration: 166,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDNlNmViNWQtYTRhMi00ZDU2LThlZmYtZGQ2ZmI1NjA2MTJmXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg',
    backdropUrls: [
      'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5TASgd.jpg',
      'https://image.tmdb.org/t/p/original/fypydCipcWDKDTTUFPYhRFcGOht.jpg',
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=U2Qp5pL3ovA',
    status: 'NOW_SHOWING',
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    releaseDate: new Date('2023-07-21T00:00:00.000Z'),
    duration: 180,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_FMjpg_UX1000_.jpg',
    backdropUrls: ['https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg'],
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    status: 'NOW_SHOWING',
  },
];

const seedMovies = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully.');

    // await Movie.deleteMany({}); // DO NOT delete old movies
    // console.log('Old movies deleted.');

    for (const movieData of movies) {
      const slug = slugify(movieData.title, { lower: true, strict: true });

      const moviePayload = {
        ...movieData,
        slug,
      };
      
      const query = { slug: moviePayload.slug };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      await Movie.findOneAndUpdate(query, moviePayload, options);
      console.log(`Movie "${movieData.title}" upserted successfully.`);
    }

    console.log('✅ Movie seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

seedMovies(); 