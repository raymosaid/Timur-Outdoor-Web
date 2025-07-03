import { useEffect, useRef } from "react"

export const AudioComponent = () => {
  const audioRef = useRef(null)
  useEffect(() => {
      const audio = audioRef.current
      if (audio) {
        audio.volume = 0.2
        audio.play().catch(err => {
          console.warn('Audio playback failed:', err)
        })
      }
    }, [])

  return (
    <>
      <audio ref={audioRef} src="https://media.geeksforgeeks.org/wp-content/uploads/20231004184006/SoundHelix-Song-10.mp3" loop />
      {/* <audio ref={audioRef} src="/travel-vlog-backsound-music-299546.mp3" loop /> */}
      {/* <audio ref={audioRef}>
        <source src="/travel-vlog-backsound-music-299546.mp3" type="audio/mp3"/>
      </audio> */}
      {/* <audio ref={audioRef} autoPlay loop muted id="background-audio">
        <source src="/travel-vlog-backsound-music-299546.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}
    </>
  )
}