const couchSettings = {
  ip : "192.168.15.49",
  port : 5984,
  user : "root",
  pwd  : "root",
  database : "tcc"
};

function formatDateStringToShortDateTime(t){
  let d = new Date(t);
  return d.toLocaleDateString()+" "+d.toLocaleTimeString();
}


function getImageUrl(id){
  return `${imageServerURL}/img${id}.jpg`;
}

const imageServerURL = "http://192.168.15.49:8080";

export {
  couchSettings,
  formatDateStringToShortDateTime,
  getImageUrl,
  imageServerURL
};
