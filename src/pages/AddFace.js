import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Webcam from "react-webcam";

const AddFace = () => {
  const history = useHistory();
  const [countdown, setCountdown] = useState(false);
  const [timer, setTimer] = useState(4);
  const [imgSrc, setImgSrc] = useState(null);
  const [saveImageOption, setSaveImageOption] = useState(false);
  const webcamRef = useRef(null);
  const interval = useRef(null);

  useEffect(() => {
    if (timer === 0) {
      capture();
      clearInterval(interval.current);
      setCountdown(false);
      setTimer(4);
      setSaveImageOption(true);
    }
    // eslint-disable-next-line
  }, [timer]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const backHome = () => {
    history.push("/");
  };

  const startCountdown = () => {
    setCountdown(true);
    const startTimer = () => {
      setTimer((prevState) => prevState - 1);
    };
    interval.current = setInterval(startTimer, 1000);
  };

  const savePhoto = () => {
    // Axios blablabla
    backHome();
  }

  const takeAnotherPhoto = () => {
    setSaveImageOption(false);
    setImgSrc(null);
  }

  return (
    <div className="mt-4">
      {imgSrc ? <img src={imgSrc} alt="Selfie" /> : <Webcam mirrored={true} screenshotFormat="image/jpeg" audio={false} ref={webcamRef} />}
      {countdown ? (
        <>
          <br />
          <button type="button" className="btn btn-secondary btn-lg mt-2">
            {timer}
          </button>
        </>
      ) : saveImageOption ? (
        <>
          <br />
          <button type="button" className="btn btn-success btn-lg mt-2" onClick={savePhoto}>
            Save Photo
          </button>
          <br />
          <button type="button" className="btn btn-danger btn-lg mt-2" onClick={takeAnotherPhoto}>
            Take Another Photo
          </button>
        </>
      ) : (
        <>
          <br />
          <button type="button" className="btn btn-success btn-lg mt-2" onClick={startCountdown}>
            Take Photo
          </button>
        </>
      )}
      <br />
      <button type="button" className="btn btn-warning mt-3 btn-lg" onClick={backHome}>
        Back to Home
      </button>
    </div>
  );
};

export default AddFace;
