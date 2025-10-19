import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import LoadingStatus from "./LoadingStatus.jsx";
import StoryGame from "./StoryGame.jsx";
import { API_BASE_URL } from "../utils.ts";

function StoryLoader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStory(Number(id));
  }, [id]);

  const loadStory = async (storyId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/stories/${storyId}/complete`
      );
      setStory(response.data);
      console.log(response.data, "response.data");
      setLoading(false);
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 404) {
        setError("Story is not found.");
      } else {
        setError("Failed to load story");
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(id, "id");

  const createNewStory = () => {
    navigate("/");
  };

  if (loading) {
    return <LoadingStatus theme={"story"} />;
  }

  if (error) {
    return (
      <div className="story-loader">
        <div className="error-message">
          <h2>Story Not Found</h2>
          <p>{error}</p>
          <button onClick={createNewStory}>Go to Story Generator</button>
        </div>
      </div>
    );
  }

  if (story) {
    return (
      <div className="story-loader">
        <StoryGame story={story} onNewStory={createNewStory} />
      </div>
    );
  }
}

export default StoryLoader;
