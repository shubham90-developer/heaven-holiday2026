"use client";

import ComponentContainerCard from "@/components/ComponentContainerCard";
import { FileUploader } from "@/components/FileUploader";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Card,
  Badge,
} from "react-bootstrap";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetPodcastsQuery,
  useCreatePodcastMutation,
  useUpdatePodcastMutation,
  useDeletePodcastMutation,
  useGetEpisodesQuery,
  useAddEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
} from "@/app/redux/api/podcasts/podcastsApi";

import Link from "next/link";

type ModalType = "podcast" | "episode" | "episodes-list" | null;
type AlertType = {
  show: boolean;
  message: string;
  variant: "success" | "danger" | "warning" | "info";
};

const quillModules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "super" }, { script: "sub" }],
    [{ header: [false, 1, 2, 3, 4, 5, 6] }, "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["direction", { align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const PodcastsPage = () => {
  // --- Data fetching & mutations ---
  const { data, isLoading, isError } = useGetPodcastsQuery(undefined);
  const [createPodcast] = useCreatePodcastMutation();
  const [updatePodcast] = useUpdatePodcastMutation();
  const [deletePodcast] = useDeletePodcastMutation();
  const [addEpisode] = useAddEpisodeMutation();
  const [updateEpisode] = useUpdateEpisodeMutation();
  const [deleteEpisode] = useDeleteEpisodeMutation();

  const podcasts = data?.data || [];

  // --- State ---
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Podcast state
  const [podcastId, setPodcastId] = useState<string | null>(null);
  const [podcastTitle, setPodcastTitle] = useState("");
  const [podcastDuration, setPodcastDuration] = useState("");
  const [podcastLanguage, setPodcastLanguage] = useState("");
  const [podcastDescription, setPodcastDescription] = useState("");
  const [podcastCover, setPodcastCover] = useState<File | null>(null);
  const [podcastCoverPreview, setPodcastCoverPreview] = useState("");
  const [existingCoverUrl, setExistingCoverUrl] = useState("");
  const [podcastStatus, setPodcastStatus] = useState("active");
  const [episodeAudio, setEpisodeAudio] = useState<File | null>(null);
  // Episode state
  const [selectedPodcastId, setSelectedPodcastId] = useState<string | null>(
    null,
  );
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeDate, setEpisodeDate] = useState("");
  const [episodeDuration, setEpisodeDuration] = useState("");
  const [episodeAudioUrl, setEpisodeAudioUrl] = useState("");
  const [episodeStatus, setEpisodeStatus] = useState("active");

  const [alert, setAlert] = useState<AlertType>({
    show: false,
    message: "",
    variant: "success",
  });

  const showAlert = (message: string, variant: AlertType["variant"]) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "success" });
    }, 5000);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setIsEditMode(false);
    setIsSubmitting(false);
    setPodcastId(null);
    setPodcastTitle("");
    setPodcastDuration("");
    setPodcastLanguage("");
    setPodcastDescription("");
    setPodcastCover(null);
    setPodcastCoverPreview("");
    setExistingCoverUrl("");
    setPodcastStatus("active");
    setEpisodeId(null);
    setEpisodeTitle("");
    setEpisodeDate("");
    setEpisodeDuration("");
    setEpisodeAudioUrl("");
    setEpisodeStatus("active");
  };

  // --- Podcast Modal Handlers ---
  const handleCoverChange = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      setPodcastCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPodcastCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setPodcastCover(null);
    setPodcastCoverPreview("");
    if (isEditMode) {
      setExistingCoverUrl("");
    }
  };

  const handleOpenPodcastModal = (editMode: boolean, podcast?: any) => {
    setIsEditMode(editMode);
    if (editMode && podcast) {
      setPodcastId(podcast._id);
      setPodcastTitle(podcast.title);
      setPodcastDuration(podcast.duration);
      setPodcastLanguage(podcast.language);
      setPodcastDescription(podcast.description);
      setExistingCoverUrl(podcast.cover || "");
      setPodcastCoverPreview("");
      setPodcastStatus(podcast.status || "active");
      setPodcastCover(null);
    } else {
      setPodcastId(null);
      setPodcastTitle("");
      setPodcastDuration("");
      setPodcastLanguage("");
      setPodcastDescription("");
      setPodcastCover(null);
      setPodcastCoverPreview("");
      setExistingCoverUrl("");
      setPodcastStatus("active");
    }
    setModalType("podcast");
  };

  const handlePodcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !podcastTitle ||
      !podcastDuration ||
      !podcastLanguage ||
      !podcastDescription
    ) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    if (!isEditMode && !podcastCover) {
      showAlert("Please upload a cover image!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && podcastId) {
        const updateData: any = {
          id: podcastId,
          title: podcastTitle,
          duration: podcastDuration,
          language: podcastLanguage,
          description: podcastDescription,
          status: podcastStatus,
        };

        if (podcastCover) {
          updateData.cover = podcastCover;
        }

        await updatePodcast(updateData).unwrap();
        showAlert("Podcast updated successfully!", "success");
      } else {
        const createData = {
          title: podcastTitle,
          duration: podcastDuration,
          language: podcastLanguage,
          description: podcastDescription,
          cover: podcastCover,
          status: podcastStatus,
        };

        await createPodcast(createData).unwrap();
        showAlert("Podcast created successfully!", "success");
      }
      handleCloseModal();
    } catch (err: any) {
      showAlert(
        err?.data?.message || `${isEditMode ? "Update" : "Creation"} failed!`,
        "danger",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePodcast = async (id: string) => {
    if (!confirm("Are you sure you want to delete this podcast?")) return;
    try {
      await deletePodcast(id).unwrap();
      showAlert("Podcast deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  // --- Episode Modal Handlers ---
  const handleOpenEpisodesListModal = (podcast: any) => {
    setSelectedPodcastId(podcast._id);
    setModalType("episodes-list");
  };

  const handleOpenEpisodeModal = (editMode: boolean, episode?: any) => {
    setIsEditMode(editMode);
    if (editMode && episode) {
      setEpisodeId(episode._id);
      setEpisodeTitle(episode.title);
      setEpisodeDate(
        episode.date ? new Date(episode.date).toISOString().split("T")[0] : "",
      );
      setEpisodeDuration(episode.duration);
      setEpisodeAudioUrl(episode.audioUrl || "");
      setEpisodeStatus(episode.status || "active");
    } else {
      setEpisodeId(null);
      setEpisodeTitle("");
      setEpisodeDate(new Date().toISOString().split("T")[0]);
      setEpisodeDuration("");
      setEpisodeAudioUrl("");
      setEpisodeStatus("active");
    }
    setModalType("episode");
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!episodeTitle || !episodeDuration || !episodeDate) {
      showAlert("Please fill all required fields!", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", episodeTitle);
      formData.append("date", episodeDate);
      formData.append("duration", episodeDuration);
      formData.append("status", episodeStatus);

      if (episodeAudio) {
        formData.append("audio", episodeAudio); // ✅ Add audio file
      }

      if (isEditMode && episodeId) {
        await updateEpisode({
          podcastId: selectedPodcastId,
          episodeId: episodeId,
          data: formData,
        }).unwrap();
      } else {
        await addEpisode({
          podcastId: selectedPodcastId,
          title: episodeTitle,
          date: episodeDate,
          duration: episodeDuration,
          status: episodeStatus,
          audio: episodeAudio,
        }).unwrap();
      }

      showAlert("Episode saved successfully!", "success");
      setModalType("episodes-list");
    } catch (err: any) {
      showAlert(err?.data?.message || "Failed!", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEpisode = async (epId: string) => {
    if (!confirm("Are you sure you want to delete this episode?")) return;
    if (!selectedPodcastId) return;

    try {
      await deleteEpisode({
        podcastId: selectedPodcastId,
        episodeId: epId,
      }).unwrap();
      showAlert("Episode deleted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.data?.message || "Delete failed!", "danger");
    }
  };

  const getModalTitle = () => {
    if (modalType === "podcast") {
      return isEditMode ? "Edit Podcast" : "Add Podcast";
    }
    if (modalType === "episode") {
      return isEditMode ? "Edit Episode" : "Add Episode";
    }
    if (modalType === "episodes-list") {
      return "Manage Episodes";
    }
    return "";
  };

  const renderModalContent = () => {
    if (modalType === "podcast") {
      const showExistingCover =
        isEditMode && existingCoverUrl && !podcastCoverPreview;
      const showNewPreview = podcastCoverPreview && podcastCover;
      const hasCover = showExistingCover || showNewPreview;

      return (
        <Form onSubmit={handlePodcastSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={podcastTitle}
              onChange={(e) => setPodcastTitle(e.target.value)}
              placeholder="Enter podcast title"
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duration *</Form.Label>
                <Form.Control
                  type="text"
                  value={podcastDuration}
                  onChange={(e) => setPodcastDuration(e.target.value)}
                  placeholder="e.g., 45 min"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Language *</Form.Label>
                <Form.Control
                  type="text"
                  value={podcastLanguage}
                  onChange={(e) => setPodcastLanguage(e.target.value)}
                  placeholder="e.g., English"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <div style={{ height: "250px" }}>
              <ReactQuill
                theme="snow"
                value={podcastDescription}
                onChange={setPodcastDescription}
                modules={quillModules}
                placeholder="Enter podcast description..."
                style={{ height: "200px", marginBottom: "50px" }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Cover Image {!isEditMode && "*"}
              {isEditMode && " (Leave empty to keep current image)"}
            </Form.Label>

            {hasCover && (
              <Card className="mb-3 mt-1 shadow-none border">
                <div className="p-2">
                  <Row className="align-items-center">
                    <Col xs={"auto"}>
                      <img
                        src={
                          showNewPreview
                            ? podcastCoverPreview
                            : existingCoverUrl
                        }
                        alt={showNewPreview ? "Preview" : "Current"}
                        className="avatar-sm rounded bg-light"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                    <Col className="ps-0">
                      <p className="text-muted fw-bold mb-0">
                        {showNewPreview ? podcastCover.name : "Current Cover"}
                      </p>
                      <p className="mb-0 small text-muted">
                        {showNewPreview
                          ? `${(podcastCover.size / 1024).toFixed(2)} KB`
                          : "Upload new to replace"}
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Link
                        href=""
                        className="btn btn-link btn-lg text-muted"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveCover();
                        }}
                      >
                        <IconifyIcon icon="tabler:x" />
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Card>
            )}

            {!hasCover && (
              <FileUploader
                onFileUpload={handleCoverChange}
                icon="ri:upload-cloud-2-line"
                text="Drop cover image here or click to upload."
                extraText={
                  isEditMode
                    ? "(Upload a new image to replace the existing one)"
                    : "(This is a required field)"
                }
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={podcastStatus}
              onChange={(e) => setPodcastStatus(e.target.value)}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "episode") {
      return (
        <Form onSubmit={handleEpisodeSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Episode Title *</Form.Label>
            <Form.Control
              type="text"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              placeholder="Enter episode title"
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={episodeDate}
                  onChange={(e) => setEpisodeDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duration *</Form.Label>
                <Form.Control
                  type="text"
                  value={episodeDuration}
                  onChange={(e) => setEpisodeDuration(e.target.value)}
                  placeholder="e.g., 30 min"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Audio File *</Form.Label>
            <FileUploader
              onFileUpload={(files) => {
                if (files && files.length > 0) {
                  setEpisodeAudio(files[0]);
                }
              }}
              icon="ri:upload-cloud-2-line"
              text="Drop audio file here or click to upload."
              extraText="(Supported: MP3, WAV, M4A, AAC)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status *</Form.Label>
            <Form.Select
              value={episodeStatus}
              onChange={(e) => setEpisodeStatus(e.target.value)}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setModalType("episodes-list")}
            >
              Back
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : isEditMode ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </Form>
      );
    }

    if (modalType === "episodes-list") {
      const currentPodcast = podcasts.find(
        (p: any) => p._id === selectedPodcastId,
      );
      const episodes = currentPodcast?.episodesList || [];

      return (
        <>
          <div className="mb-3">
            <Button onClick={() => handleOpenEpisodeModal(false)}>
              <IconifyIcon icon="tabler:plus" className="me-1" />
              Add Episode
            </Button>
          </div>

          <div className="table-responsive-sm">
            <table className="table table-striped-columns mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {episodes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <p className="text-muted mb-0">No episodes found!</p>
                    </td>
                  </tr>
                ) : (
                  episodes.map((episode: any, index: number) => (
                    <tr key={episode._id || index}>
                      <td>{index + 1}</td>
                      <td>{episode.title}</td>
                      <td>
                        {episode.date
                          ? new Date(episode.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{episode.duration}</td>
                      <td>
                        <span
                          className={`badge ${
                            episode.status === "active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {episode.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <Link
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenEpisodeModal(true, episode);
                          }}
                          className="link-reset fs-20 p-1"
                        >
                          <IconifyIcon icon="tabler:pencil" />
                        </Link>
                        <Link
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteEpisode(episode._id);
                          }}
                          className="link-reset fs-20 p-1"
                        >
                          <IconifyIcon icon="tabler:trash" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        </>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <IconifyIcon
            icon="solar:danger-triangle-bold-duotone"
            className="fs-20 me-2"
          />
          <div>
            <strong>Error!</strong> Failed to load podcasts. Please try again
            later.
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <PageTitle
            title="Podcasts Management"
            subTitle="Content Management"
          />

          {alert.show && (
            <Alert
              variant={alert.variant}
              dismissible
              onClose={() => setAlert({ ...alert, show: false })}
              className="d-flex align-items-center mb-3"
            >
              <IconifyIcon
                icon={
                  alert.variant === "success"
                    ? "solar:check-read-line-duotone"
                    : alert.variant === "danger"
                      ? "solar:danger-triangle-bold-duotone"
                      : alert.variant === "warning"
                        ? "solar:shield-warning-line-duotone"
                        : "solar:info-circle-bold-duotone"
                }
                className="fs-20 me-2"
              />
              <div className="lh-1">{alert.message}</div>
            </Alert>
          )}

          <ComponentContainerCard
            title="Podcasts"
            description="Manage your podcasts and their episodes."
          >
            <div className="mb-3">
              <Button onClick={() => handleOpenPodcastModal(false)}>
                <IconifyIcon icon="tabler:plus" className="me-1" />
                Add Podcast
              </Button>
            </div>

            <div className="table-responsive-sm">
              <table className="table table-striped-columns mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>Language</th>
                    <th>Episodes</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {podcasts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        <p className="text-muted mb-0">No podcasts found!</p>
                      </td>
                    </tr>
                  ) : (
                    podcasts.map((podcast: any, index: number) => (
                      <tr key={podcast._id || index}>
                        <td>{index + 1}</td>
                        <td>
                          {podcast.cover && (
                            <img
                              src={podcast.cover}
                              alt={podcast.title}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          )}
                        </td>
                        <td>{podcast.title}</td>
                        <td>{podcast.duration}</td>
                        <td>{podcast.language}</td>
                        <td>
                          <Badge bg="info">
                            {podcast.episodesList?.length || 0}
                          </Badge>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              podcast.status === "active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {podcast.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenEpisodesListModal(podcast);
                            }}
                            className="link-reset fs-20 p-1"
                            title="Manage Episodes"
                          >
                            <IconifyIcon icon="tabler:list" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenPodcastModal(true, podcast);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:pencil" />
                          </Link>
                          <Link
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeletePodcast(podcast._id);
                            }}
                            className="link-reset fs-20 p-1"
                          >
                            <IconifyIcon icon="tabler:trash" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      <Modal
        show={modalType !== null}
        onHide={handleCloseModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{getModalTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderModalContent()}</Modal.Body>
      </Modal>
    </>
  );
};

export default PodcastsPage;
