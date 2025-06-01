import formidable from 'formidable';

export const parseFormData = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, 
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return reject(err);
      }

      resolve({ fields, files });
    });
  });
};
