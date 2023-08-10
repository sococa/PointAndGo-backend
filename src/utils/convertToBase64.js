/**
 * On ne peut pas directement envoyer un buffer à Cloudinary. 
 * C'est la raison pour laquelle nous allons devoir transformer 
 * le buffer en base64, qui est un format compréhensible par Cloudinary.
 * 
 * 
 */

const convertToBase64 = (file) => {
	return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};


module.exports = convertToBase64;