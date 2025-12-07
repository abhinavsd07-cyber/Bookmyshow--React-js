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
      .get(`https://bookmyshow-server-json.onrender.com/movies/${Number(movieId)}`)
      .then((res) => {
        const movieData = res.data;
        setMovie(movieData);

        const th = movieData.theatres.find((t) => t.id === Number(theatreId));
        setTheatre(th);

        const sh = th.shows.find((s) => s.showId === Number(showId));
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

  // Toggle a single seat
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

  const buildPayloadSeats = () =>
    selectedSeats.map((s) => {
      const parts = s.split("-");
      return {
        type: parts[0],
        rowIndex: parseInt(parts[1], 10),
        seat: parts.slice(2).join("-"),
      };
    });

  // Booking function
  const handleProceed = async () => {
    if (!selectedSeats.length) {
      Swal.fire("Select seats", "Please choose at least one seat.", "warning");
      return;
    }

    const payloadSeats = buildPayloadSeats();

    // Update local bookedSeats array
    setShow((prevShow) => {
      const updated = { ...prevShow };
      payloadSeats.forEach((s) => {
        if (!updated.seats[s.type].bookedSeats.includes(s.seat)) {
          updated.seats[s.type].bookedSeats.push(s.seat);
        }
      });
      return updated;
    });

    // Generate booking ID
    const bookingId = Math.floor(Math.random() * 900000) + 100000;

    // Prepare seat text
    const seatsText = payloadSeats.map((s) => `${s.type.toUpperCase()}-${s.seat}`).join(", ");

    // Clear selection
    setSelectedSeats([]);

    // Show confirmation
    const result = await Swal.fire({
      title: "Booking Confirmed!",
      html: `
        <p><b>Movie:</b> ${movie.title}</p>
        <p><b>Theatre:</b> ${theatre.name}</p>
        <p><b>Date:</b> ${show.date}</p>
        <p><b>Time:</b> ${show.time}</p>
        <p><b>Seats:</b> ${seatsText}</p>
        <p><b>Booking ID:</b> ${bookingId}</p>
      `,
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
  };

  // Generate PDF ticket
  const generateTicketPDF = async ({ bookingId, payloadSeats }) => {
    try {
      const ticketDiv = document.createElement("div");
      ticketDiv.style.width = "480px";
      ticketDiv.style.padding = "20px";
      ticketDiv.style.background = "#fff";
      ticketDiv.style.color = "#111";
      ticketDiv.style.borderRadius = "12px";
      ticketDiv.style.fontFamily = "Poppins, Arial, sans-serif";
      ticketDiv.style.boxSizing = "border-box";

      const groupedSeats = {};
      payloadSeats.forEach((s) => {
        if (!groupedSeats[s.type]) groupedSeats[s.type] = [];
        groupedSeats[s.type].push(s.seat);
      });
      const seatsHtml = Object.keys(groupedSeats)
        .map((t) => `<div><strong>${t.toUpperCase()}:</strong> ${groupedSeats[t].join(", ")}</div>`)
        .join("");

      const posterHtml = movie.poster
        ? `<img src="${movie.poster}" style="width:140px;height:200px;object-fit:cover;border-radius:8px;margin-right:16px" />`
        : `<div style="width:140px;height:200px;background:#eee;display:flex;align-items:center;justify-content:center;color:#444;border-radius:8px;margin-right:16px">No Image</div>`;

      ticketDiv.innerHTML = `
        <div style="display:flex;">
          ${posterHtml}
          <div>
            <h2 style="margin:0 0 6px 0;">${movie.title}</h2>
            <p>${theatre.name} • ${theatre.location}</p>
            <p>Date: <strong>${show.date}</strong></p>
            <p>Time: <strong>${show.time}</strong></p>
            ${seatsHtml}
            <p>Booking ID: <strong>${bookingId}</strong></p>
          </div>
        </div>
        <hr style="margin:16px 0">
        <div style="font-size:12px;color:#555;display:flex;justify-content:space-between">
          <span>Generated: ${new Date().toLocaleString()}</span>
          <span>Enjoy the show 🎬</span>
        </div>
      `;

      ticketDiv.style.position = "fixed";
      ticketDiv.style.left = "-9999px";
      document.body.appendChild(ticketDiv);

      const canvas = await html2canvas(ticketDiv, { scale: 3, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 15, imgWidth, imgHeight);
      pdf.save(`${movie.title.replace(/\s+/g, "_")}_ticket_${bookingId}.pdf`);

      document.body.removeChild(ticketDiv);
    } catch (err) {
      console.error("PDF generation failed:", err);
      Swal.fire("Error", "Failed to generate ticket PDF.", "error");
    }
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
                      onClick={() => toggleSeat(type, rowIndex, seat)}
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
        <p><b>Seats:</b> {selectedSeats.length ? selectedSeats.map(s => s.split("-")[2]).join(", ") : "None"}</p>
        <button className="btn-proceed" disabled={selectedSeats.length === 0} onClick={handleProceed}>
          Proceed & Download
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
