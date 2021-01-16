import { useEffect, useRef, useState } from "react";
import { nets, loadFaceLandmarkModel, loadFaceRecognitionModel, SsdMobilenetv1Options, detectSingleFace, fetchImage, FaceMatcher, LabeledFaceDescriptors, utils } from "face-api.js";
import allImages from "../images.json";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();
  const inputVideo = useRef(null);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [valueName, setValueName] = useState("unknown");
  const [time, setTime] = useState("-");
  const [fps, setFps] = useState("-");
  const [loading, setLoading] = useState(true);
  const [stream, setStream] = useState(null);
  let forwardTimes = [];

  useEffect(() => {
    const init = async () => {
      try {
        // Load model
        await nets.ssdMobilenetv1.load("/models");
        await loadFaceLandmarkModel("/models");
        await loadFaceRecognitionModel("/models");

        // Fetch Image and Create Face Matcher
        const descriptor = await Promise.all(
          allImages.map(async (data) => {
            const input = await fetchImage(`images/${data}`);
            const fullFaceDescription = await detectSingleFace(input).withFaceLandmarks().withFaceDescriptor();
            return new LabeledFaceDescriptors(data.split(".")[0], [fullFaceDescription.descriptor]);
          })
        );
        setFaceMatcher(new FaceMatcher(descriptor, 0.6));

        // Stream Video
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        inputVideo.current.srcObject = stream;
        setStream(stream);
        setLoading(false);
      } catch (err) {
        window.location.reload();
      }
    };
    init();
    return;
  }, []);

  const updateTimeStats = (timeInMs) => {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
    const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
    const time = `${Math.round(avgTimeInMs)} ms`;
    const fps = `${utils.round(1000 / avgTimeInMs)}`;
    setTime(time);
    setFps(fps);
  };

  const onPlay = async () => {
    if (inputVideo.current.paused || inputVideo.current.ended || !!!nets.ssdMobilenetv1.params) return setTimeout(() => onPlay());

    const options = new SsdMobilenetv1Options({ minConfidence: 0.5 });

    const ts = Date.now();

    const result = await detectSingleFace(inputVideo.current, options).withFaceLandmarks().withFaceDescriptor();

    updateTimeStats(Date.now() - ts);

    if (result) {
      // Find Best Match
      const bestMatch = faceMatcher.findBestMatch(result.descriptor);
      setValueName(bestMatch.toString());
    }
    if (inputVideo.current) setTimeout(() => onPlay());
  };

  const addFace = () => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    history.push("/addface");
  };
  return (
    <div>
      <div style={{ position: "relative", marginTop: "50px" }}>
        <video ref={inputVideo} onLoadedMetadata={onPlay} autoPlay muted playsInline style={{ transform: "scaleX(-1)" }}></video>
        {loading ? (
          <h1>Loading ...</h1>
        ) : (
          <>
            <h1 className="mt-2">{valueName}</h1>
            <div>
              <div>
                <label htmlFor="time">Time:</label>
                <input disabled value={time} type="text" className="bold" />
                <br />
                <label htmlFor="fps">Estimated Fps:</label>
                <input disabled value={fps} type="text" className="bold" />
              </div>
            </div>
            <button type="button" className="btn btn-primary mt-3" onClick={addFace}>
              Add Your Face
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
