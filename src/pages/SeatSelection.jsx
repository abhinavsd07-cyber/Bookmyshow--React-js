// src/pages/SeatSelection.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./SeatSelection.css";

const SeatSelection = () => {
  const { movieId, theatreId, showId } = useParams();

  const [movie, setMovie] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatTypes = ["gold", "platinum", "recliner"];

  useEffect(() => {
    axios
      .get(`http://localhost:8000/movies/${movieId}`)
      .then((res) => {
        const movieData = res.data;
        setMovie(movieData);

        const th = movieData.theatres.find(
          (t) => t.id === parseInt(theatreId, 10)
        );
        setTheatre(th);

        const sh = th.shows.find((s) => s.showId === parseInt(showId, 10));
        setShow(sh);
      })
      .catch((err) => {
        console.error("Failed to load movie/theatre/show:", err);
        Swal.fire("Error", "Failed to load show data.", "error");
      });
  }, [movieId, theatreId, showId]);

  if (!movie || !theatre || !show) {
    return <p className="loading">Loading seat selection…</p>;
  }

  const toggleSeat = (type, rowIndex, seat) => {
    const seatId = `${type}-${rowIndex}-${seat}`;
    if (show.seats[type].bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const isSelected = (type, rowIndex, seat) =>
    selectedSeats.includes(`${type}-${rowIndex}-${seat}`);

  const isBooked = (type, seat) => show.seats[type].bookedSeats.includes(seat);

  // build payload from selectedSeats
  const buildPayloadSeats = () =>
    selectedSeats.map((s) => {
      const parts = s.split("-");
      return {
        type: parts[0],
        rowIndex: parseInt(parts[1], 10),
        seat: parts.slice(2).join("-"),
      };
    });

  // Create a premium ticket DOM, capture with html2canvas and download pdf
  const generateTicketPDF = async ({ bookingId, payloadSeats }) => {
    try {
      // fetch poster as base64 using your server proxy to avoid CORS & embedding issues
      let posterBase64 = null;
      try {
        const proxyResp = await axios.get("http://localhost:8000/image-proxy", {
          params: { url: movie.poster },
        });
        posterBase64 = proxyResp.data.base64;
      } catch (err) {
        console.warn("Poster proxy failed, poster will be omitted in PDF", err);
      }

      // Create a temporary DOM node for the ticket
      const ticketDiv = document.createElement("div");
      ticketDiv.id = "ticket-temp";
      // Inline styles ensure the captured image is consistent
      ticketDiv.style.width = "480px";
      ticketDiv.style.padding = "20px";
      ticketDiv.style.background = "#ffffff";
      ticketDiv.style.color = "#111";
      ticketDiv.style.borderRadius = "12px";
      ticketDiv.style.fontFamily = "Poppins, Arial, sans-serif";
      ticketDiv.style.boxSizing = "border-box";
      ticketDiv.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
      ticketDiv.style.margin = "0 auto";

      // Compose seats string grouped by type for professional look
      const grouped = {};
      payloadSeats.forEach((p) => {
        if (!grouped[p.type]) grouped[p.type] = [];
        grouped[p.type].push(p.seat);
      });
      const seatsHtml = Object.keys(grouped)
        .map((t) => `<div style="margin-bottom:6px;"><strong style="text-transform:capitalize">${t}:</strong> ${grouped[t].join(", ")}</div>`)
        .join("");

      // Build inner HTML for the ticket
      ticketDiv.innerHTML = `
        <div style="display:flex; gap:16px; align-items:flex-start;">
          ${
            posterBase64
              ? `<img src="${posterBase64}" style="width:140px;height:200px;object-fit:cover;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.12)" alt="poster" />`
              : `<div style="width:140px;height:200px;border-radius:8px;background:#eee;display:flex;align-items:center;justify-content:center;color:#444">No Image</div>`
          }
          <div style="flex:1">
            <h2 style="margin:0 0 6px 0;font-size:18px;color:#111">${escapeHtml(movie.title)}</h2>
            <div style="color:#333;font-size:13px;margin-bottom:8px;">${escapeHtml(theatre.name)} • ${escapeHtml(theatre.location || "")}</div>
            <div style="font-size:13px;color:#333;margin-bottom:8px;">Date: <strong>${escapeHtml(show.date)}</strong></div>
            <div style="font-size:13px;color:#333;margin-bottom:8px;">Time: <strong>${escapeHtml(show.time)}</strong></div>
            <div style="font-size:13px;color:#333;margin-bottom:8px;">${seatsHtml}</div>
            <div style="margin-top:12px;padding:8px;border-radius:8px;background:#f6f6f6;color:#111;font-weight:600;display:inline-block">Booking ID: ${bookingId}</div>
          </div>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#555">
          <div>Generated: ${new Date().toLocaleString()}</div>
          <div style="font-weight:700;color:#111">Enjoy the show 🎬</div>
        </div>
      `;

      // put off-screen so it's not visible to user
      ticketDiv.style.position = "fixed";
      ticketDiv.style.left = "-9999px";
      document.body.appendChild(ticketDiv);

      // capture with html2canvas
      const canvas = await html2canvas(ticketDiv, { scale: 3, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");

      // create pdf and center image
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20; // 10mm margin each side
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      const x = (pdfWidth - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", x, 15, imgWidth, imgHeight);
      pdf.save(`${movie.title.replace(/\s+/g, "_")}_ticket_${bookingId}.pdf`);

      // cleanup
      document.body.removeChild(ticketDiv);
    } catch (err) {
      console.error("PDF generation failed", err);
      Swal.fire("Error", "Failed to generate PDF ticket.", "error");
    }
  };

  const handleProceed = async () => {
    if (!selectedSeats.length) {
      Swal.fire("Select seats", "Please choose at least one seat.", "warning");
      return;
    }

    const payloadSeats = buildPayloadSeats();

    try {
      const res = await axios.post("http://localhost:8000/book", {
        movieId: parseInt(movieId, 10),
        theatreId: parseInt(theatreId, 10),
        showId: parseInt(showId, 10),
        seats: payloadSeats,
      });

      if (!(res.status === 200 || res.status === 201)) {
        throw new Error("Booking failed on server");
      }

      // bookingId from server or fallback
      const bookingId = res.data.bookingId || Math.floor(Math.random() * 900000) + 100000;

      // update local UI booked seats for immediate feedback
      setShow((prev) => {
        const updated = JSON.parse(JSON.stringify(prev));
        payloadSeats.forEach((p) => {
          if (!updated.seats[p.type].bookedSeats.includes(p.seat)) {
            updated.seats[p.type].bookedSeats.push(p.seat);
          }
        });
        return updated;
      });

      // clear selection
      setSelectedSeats([]);

      // Show nice confirmation and ask whether to download
      const htmlPreview = `
        <div style="text-align:left">
          <p><b>Movie:</b> ${escapeHtml(movie.title)}</p>
          <p><b>Theatre:</b> ${escapeHtml(theatre.name)}</p>
          <p><b>Date:</b> ${escapeHtml(show.date)}</p>
          <p><b>Time:</b> ${escapeHtml(show.time)}</p>
          <p><b>Seats:</b> ${payloadSeats.map(p => `${p.type}-${p.seat}`).join(", ")}</p>
          <p><b>Booking ID:</b> ${bookingId}</p>
        </div>
      `;
      const result = await Swal.fire({
        title: "Booking confirmed",
        html: htmlPreview,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Download Ticket",
        cancelButtonText: "Close",
        confirmButtonColor: "#f84464",
      });

      if (result.isConfirmed) {
        await generateTicketPDF({ bookingId, payloadSeats });
        Swal.fire("Downloaded!", "Your ticket has been saved.", "success");
      }
    } catch (err) {
      console.error("Booking error", err);
      const msg = err?.response?.data?.message || err.message || "Unknown error";
      Swal.fire("Booking failed", msg, "error");
    }
  };

  // small helper to escape text before inserting into HTML
  const escapeHtml = (text) => {
    if (!text && text !== 0) return "";
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  return (
    <div className="seat-page mt-5">
      <div className="seat-container">
        <div className="legend-box">
          <div className="legend-item"><span className="legend-seat available"></span> Available</div>
          <div className="legend-item"><span className="legend-seat selected"></span> Selected</div>
          <div className="legend-item"><span className="legend-seat booked"></span> Booked</div>
        </div>

        <h2 className="title">{theatre.name} — {show.time} ({show.date})</h2>
        <div className="screen">SCREEN THIS WAY</div>

        {seatTypes.map((type) => (
          <div key={type} className="category-block">
            <h3 className="category-title">₹{show.seats[type].price} {type.toUpperCase()}</h3>
            <div className="rows-wrapper">
              {show.seats[type].rows.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  {row.map((seat) => (
                    <div
                      key={seat}
                      className={isBooked(type, seat) ? "seat booked" : isSelected(type, rowIndex, seat) ? "seat selected" : "seat available"}
                      onClick={() => !isBooked(type, seat) && toggleSeat(type, rowIndex, seat)}
                    >
                      {seat}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <p><b>Movie:</b> {movie.title}</p>
        <p><b>Theatre:</b> {theatre.name}</p>
        <p><b>Date:</b> {show.date}</p>
        <p><b>Time:</b> {show.time}</p>
        <p><b>Seats:</b> {selectedSeats.length ? selectedSeats.join(", ") : "None"}</p>
        <button className="btn-proceed" disabled={selectedSeats.length === 0} onClick={handleProceed}>
          Proceed & Download
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
