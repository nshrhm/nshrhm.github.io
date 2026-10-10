// Restore the verified Wikimedia thumbnails. Refuse unexpected replacement bytes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const photos=JSON.parse(fs.readFileSync(path.join(root,'sources/photos.json'),'utf8'));
for(const photo of photos){
 const bytes=execFileSync('curl',['-fLsS','--max-time','30',photo.downloadURL]);
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 if(hash!==photo.sha256)throw Error(`Source changed: ${photo.file}; verify the original and credits before updating.`);
 fs.mkdirSync(path.dirname(path.join(root,photo.file)),{recursive:true});
 fs.writeFileSync(path.join(root,photo.file),bytes);
 console.log(`Verified ${photo.file}`);
}
