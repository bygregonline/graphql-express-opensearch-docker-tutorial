export const typeDefs = `#graphql

  type Song {  title: String
        artist: String
        album: String
        genre: String
        tracknumber: String
        year: String
        comments: String
        lyrics_len: Int
  }

  type Query {
    all: [Song],
    single: Song
  },


`;
