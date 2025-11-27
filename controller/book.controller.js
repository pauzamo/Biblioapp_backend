const axios = require('axios');

const getBooks = async (req, res) => {
  try {
    const searchTerm = req.query.q || 'harry potter'; // Default si no se pasa
    const response = await axios.get(`https://openlibrary.org/search.json?q=${searchTerm}`);

    const books = response.data.docs.slice(0, 10).map(doc => {
      const coverId = doc.cover_i;

      return {
        id: doc.key ? doc.key.replace('/works/', '') : `book-${index}`,
        title: doc.title,
        author: doc.author_name ? doc.author_name.join(', ') : 'Desconocido',
        year: doc.first_publish_year || 'N/A',
        price: Math.floor(Math.random() * 50000) + 10000,
        cover: coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : 'https://placehold.co/128x195?text=Sin+imagen'
      };
    });

    res.json(books);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
};

module.exports = { getBooks };
