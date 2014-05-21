cd assets/audio/
for file in *.mp3; do 
	ffmpeg -i "${file}" "${file/%mp3/ogg}"
	ffmpeg -i "${file}" "${file/%mp3/wav}"
done
