export const generateTourHtml = (
  tour: any,
  contactDetails?: any,
  settings?: any,
): string => {
  const phone = contactDetails?.callUs?.phoneNumbers?.[0] || '18003135555';
  const email =
    contactDetails?.writeToUs?.emails?.[0] || 'travel@heavenholiday.com';
  const companyName = settings?.companyName || 'Heaven Holiday';
  const companyLogo = settings?.companyLogo || '';
  const copyrightText =
    settings?.copyrightText || '© 2026 Heaven Holiday. All rights reserved.';
  // ===== BUILD DEPARTURE ROWS =====
  const departuresByCity: { [city: string]: any[] } = {};
  tour.departures?.forEach((dep: any) => {
    if (!departuresByCity[dep.city]) departuresByCity[dep.city] = [];
    departuresByCity[dep.city].push(dep);
  });

  const departureSections = Object.entries(departuresByCity)
    .map(([city, deps]) => {
      const dateCards = deps
        .map(
          (dep: any) => `
        <div class="date-card ${dep.availableSeats === 0 ? '' : 'highlight'}">
          ${new Date(dep.date).getDate()}<br>
          ₹${dep.joiningPrice?.toLocaleString('en-IN')}K
          ${dep.availableSeats === 0 ? '<div class="sold-out">Sold Out</div>' : ''}
        </div>
      `,
        )
        .join('');

      const month = deps[0]
        ? new Date(deps[0].date).toLocaleString('en-IN', {
            month: 'short',
            year: 'numeric',
          })
        : '';

      return `
      <div class="sub-title">Departure: ${city}</div>
      <div class="date-row">
        <div class="month-card">${month}</div>
        ${dateCards}
      </div>
    `;
    })
    .join('');

  // ===== BUILD ITINERARY DAYS =====
  const itineraryDays =
    tour.itinerary
      ?.map(
        (day: any) => `
    <div class="day-row">
      <img src="" alt="location" class="icon" style="display:none">
      <div>Day ${day.day} ${day.date ? `/ ${new Date(day.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}` : ''} &nbsp; ${day.title}</div>
    </div>
    <div class="itinerary-content">
      ${day.activity || ''}
    </div>
    <br/>
  `,
      )
      .join('') || '';

  // ===== BUILD ACCOMMODATION ROWS =====
  const accommodationRows =
    tour.accommodations
      ?.map(
        (acc: any) => `
    <tr>
      <td>${acc.city} - ${acc.country}</td>
      <td>${acc.hotelName || 'TBA'}</td>
      <td>
        ${acc.checkInDate ? new Date(acc.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA'} -
        ${acc.checkOutDate ? new Date(acc.checkOutDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA'}
      </td>
    </tr>
  `,
      )
      .join('') ||
    '<tr><td colspan="3">No accommodation details available</td></tr>';

  // ===== BUILD FLIGHT ROWS =====
  const flightRows =
    tour.flights
      ?.map(
        (flight: any) => `
    <tr>
      <td>${flight.fromCity} → ${flight.toCity}</td>
      <td>${flight.airline}</td>
      <td>
        ${flight.departureDate ? new Date(flight.departureDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} 
        ${flight.departureTime || ''}
      </td>
      <td>${flight.duration || 'N/A'}</td>
    </tr>
  `,
      )
      .join('') || '';

  // ===== BUILD STATES/CITIES SECTION =====
  const statesCities =
    tour.states
      ?.map(
        (state: any) => `
    <p>
      <strong>${state.name?.toUpperCase()}</strong> &nbsp;
      ${state.cities?.join(' ---- ') || ''}
    </p>
  `,
      )
      .join('') || '';

  // ===== BUILD WHY TRAVEL SECTION =====
  const whyTravelItems =
    tour.whyTravel
      ?.map(
        (reason: string) => `
    <li>${reason}</li>
  `,
      )
      .join('') || '';

  // ===== BUILD REPORTING/DROPPING =====
  const reportingRows =
    tour.reportingDropping
      ?.map(
        (rd: any) => `
    <tr>
      <td>${rd.guestType}</td>
      <td>${rd.reportingPoint}</td>
      <td>${rd.droppingPoint}</td>
    </tr>
  `,
      )
      .join('') || '';

  // ===== FULL HTML RETURN =====
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${tour.title} - Heaven Holiday</title>
  <style>
    /* ===================== BASE STYLES ===================== */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 7mm;
      box-sizing: border-box;
    }

    /* ===================== TOP SECTION ===================== */
    .top-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .contact-box {
      text-align: left;
      background: #f4c400;
      padding: 15px 20px;
      font-weight: bold;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    .icon {
      width: 20px;
      height: 20px;
    }

    .logo {
      text-align: right;
    }

    .logo h2 {
      margin: 0;
      font-size: 22px;
      color: #2b4fa2;
    }

    .logo p {
      margin: 0;
      font-size: 12px;
    }

    /* ===================== HERO ===================== */
    .hero {
      margin-top: 10px;
    }

    .hero img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    /* ===================== EXPLORE / TITLE ===================== */
    .explore {
      text-align: center;
      font-size: 28px;
      font-family: cursive;
      color: #3a4fa0;
      margin-top: 20px;
    }

    .title {
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      margin-top: 10px;
    }

    /* ===================== TOUR INFO ROW ===================== */
    .tour-info {
      text-align: center;
      margin-top: 10px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    .tour-meta-row {
      display: flex;
      gap: 5px;
      align-items: center;
    }

    /* ===================== INCLUDES ===================== */
    .includes-title {
      text-align: center;
      margin-top: 20px;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 1px;
    }

    .includes {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
    }

    /* ===================== PRICE CIRCLE ===================== */
    .price-circle {
      width: 280px;
      height: 280px;
      border: 4px solid #dcdcdc;
      border-radius: 50%;
      margin: 30px auto;
      text-align: center;
      padding-top: 40px;
      box-sizing: border-box;
    }

    .price-circle span {
      font-size: 36px;
      font-weight: 600;
      color: #2b4fa2;
      display: block;
    }

    .emi-btn {
      background: #2b4fa2;
      color: white;
      border: none;
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 20px;
      margin-top: 8px;
    }

    .price-circle a {
      display: block;
      margin-top: 8px;
      font-size: 12px;
      color: #2b4fa2;
      text-decoration: underline;
    }

    /* ===================== TOUR MAIN ===================== */
    .tour-main {
      margin-top: 20px;
    }

    .tour-main h2 {
      margin-bottom: 10px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }

    .price-details h3 {
      margin: 5px 0;
    }

    .small {
      font-size: 13px;
      font-weight: normal;
    }

    .price-details a {
      color: #1e73be;
      text-decoration: underline;
      font-size: 13px;
    }

    .book-btn {
      background: #f4c400;
      border: none;
      padding: 12px 25px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 4px;
    }

    .info-strip {
      background: #d9edf7;
      padding: 10px;
      margin-top: 15px;
      font-size: 13px;
    }

    .group-tour {
      margin-top: 15px;
      font-size: 14px;
    }

    /* ===================== STATE SECTION ===================== */
    .state-section {
      margin-top: 20px;
    }

    .state-section h4 {
      margin-bottom: 5px;
    }

    /* ===================== HIGHLIGHTS ===================== */
    .highlights ul {
      list-style: none;
      padding-left: 0;
    }

    .highlights ul li {
      margin-bottom: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
    }

    .highlights ul li::before {
      content: "◉";
      font-size: 12px;
      margin-right: 10px;
    }

    /* ===================== ITINERARY ===================== */
    .itinerary {
      margin-top: 35px;
    }

    .day-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 20px;
      background: #f0f4ff;
      padding: 8px 12px;
      border-left: 4px solid #2b4fa2;
    }

    .tour-info .day-row {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 400;
      background: none;
      border-left: none;
      padding: 0;
    }

    .itinerary-content {
      font-size: 14px;
      line-height: 1.6;
      text-align: justify;
      padding-left: 10px;
    }

    .itinerary-content p {
      margin-bottom: 10px;
    }

    .important {
      background: #fff8e1;
      border-left: 4px solid #f4c400;
      padding: 10px 15px;
      margin: 10px 0;
      font-size: 13px;
    }

    /* ===================== DESCRIPTION ===================== */
    .description {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 15px;
      text-align: justify;
    }

    /* ===================== ROW (SIGHTSEEING + MEALS) ===================== */
    .row {
      display: flex;
      justify-content: space-between;
      gap: 40px;
      margin-bottom: 25px;
    }

    .left, .right {
      width: 48%;
    }

    .right {
      margin-top: 10px;
    }

    .left-section {
      font-size: 14px;
    }

    .section-title {
      font-weight: bold;
      margin-bottom: 6px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 20px 0 10px;
    }

    /* ===================== DATES ===================== */
    .sub-title {
      font-weight: 600;
      margin: 10px 0;
      font-size: 14px;
    }

    .date-row {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .month-card {
      background: #333;
      color: #fff;
      padding: 12px 10px;
      text-align: center;
      width: 60px;
      border-radius: 4px;
      font-size: 12px;
    }

    .date-card {
      background: #e0e0e0;
      padding: 10px;
      width: 70px;
      text-align: center;
      border-radius: 4px;
      font-size: 12px;
      position: relative;
    }

    .date-card.highlight {
      background: #d9d9d9;
      font-weight: bold;
    }

    .sold-out {
      font-size: 10px;
      color: #666;
      margin-top: 3px;
    }

    .strike {
      text-decoration: line-through;
      font-size: 11px;
      color: #888;
    }

    .note-small {
      font-size: 11px;
      color: #555;
      margin-bottom: 15px;
    }

    /* ===================== DEPARTURE BOX ===================== */
    .departure-box {
      border: 1px solid #bbb;
      border-radius: 6px;
      overflow: hidden;
      margin-top: 10px;
    }

    .departure-box div {
      padding: 10px;
      font-size: 13px;
    }

    .departure-box div:nth-child(1) {
      background: #e9e9e9;
      font-weight: bold;
    }

    .departure-box div:nth-child(2) {
      background: #f4f4f4;
    }

    .departure-box div:nth-child(3) {
      background: #e9e9e9;
    }

    /* ===================== FOOTER NOTES ===================== */
    .footer-note {
      font-size: 11px;
      margin-top: 10px;
      color: #555;
    }

    .detail-price {
      font-weight: bold;
      margin-top: 30px;
      font-size: 15px;
    }

    .top-note {
      font-size: 13px;
      margin-bottom: 10px;
    }

    /* ===================== TABLES ===================== */
    .table-box {
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 25px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    table, th, td {
      border: 1px solid #bdbbbb;
    }

    thead {
      background: #e0e0e0;
      font-weight: bold;
    }

    th, td {
      padding: 8px 12px;
      text-align: left;
    }

    tbody tr:nth-child(even) {
      background: #f5f5f5;
    }

    .terms {
      font-size: 12px;
      margin-top: 5px;
    }

    /* ===================== HEADINGS ===================== */
    h1, h2, h3 {
      margin-top: 20px;
    }

    h2 {
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: bold;
      text-transform: uppercase;
      color: #2b4fa2;
    }

    h3 {
      font-size: 15px;
      margin-bottom: 15px;
      font-weight: bold;
      text-transform: uppercase;
    }

    hr {
      border: none;
      border-top: 1px solid #dcdcdc;
      margin: 20px 0;
    }

    /* ===================== FOOTER ===================== */
    .footer {
      background: #ffffff;
      margin-top: 40px;
      padding: 20px;
      text-align: center;
      color: #333;
    }

    .line {
      height: 1px;
      background-color: #dcdcdc;
      margin: 15px 0;
    }

    .footer-content {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: center;
    }

    .bottom-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-top: 10px;
      color: #555;
    }

    /* ===================== WHY TRAVEL ===================== */
    .why-travel ul {
      padding-left: 20px;
    }

    .why-travel ul li {
      margin-bottom: 8px;
      font-size: 14px;
    }

    /* ===================== BADGE ===================== */
    .badge {
      display: inline-block;
      background: #f4c400;
      color: #333;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 12px;
      margin-bottom: 8px;
    }

    /* ===================== PRINT ===================== */
    @page {
      size: A4;
      margin: 10mm;
    }

    @media print {
      body { margin: 0; }
      .page { page-break-after: always; }
      .contact-box { background: #f4c400 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .book-btn { background: #f4c400 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .info-strip { background: #d9edf7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .day-row { background: #f0f4ff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .month-card { background: #333 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .date-card { background: #e0e0e0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .date-card.highlight { background: #d9d9d9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      thead { background: #e0e0e0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tbody tr:nth-child(even) { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- ==================== HEADER ==================== -->
  <div class="top-section">
    <div class="contact-box">
      <div class="contact-item">
        <span>&#128222; ${phone}</span>
      </div>
      <div class="contact-item">
        <span>&#9993; ${email}</span>
      </div>
    </div>
  <div class="logo">
  ${
    companyLogo
      ? `<img src="${companyLogo}" alt="${companyName}" width="100" height="100" style="object-fit:contain;" />`
      : `<h2>${companyName}</h2>`
  }
  <p>Travel. Explore. Celebrate Life.</p>
</div>
  </div>

  <!-- ==================== HERO IMAGE ==================== -->
  ${
    tour.galleryImages?.[0]
      ? `
  <div class="hero">
    <img src="${tour.galleryImages[0]}" alt="${tour.title}" 
         onerror="this.style.display='none'" />
  </div>`
      : ''
  }

  <!-- ==================== TOUR TITLE ==================== -->
  <div class="explore">Explore</div>
  <div class="title">${tour.title}</div>
  ${tour.subtitle ? `<p style="text-align:center; color:#666; font-size:14px;">${tour.subtitle}</p>` : ''}

  ${tour.badge ? `<div style="text-align:center;"><span class="badge">${tour.badge}</span></div>` : ''}

  <div class="tour-info">
    <div class="day-row" style="background:none; border:none; padding:0;">
      <span>&#128197; ${tour.days || 0} Days / ${tour.nights || 0} Nights</span>
    </div>
    <div class="day-row" style="background:none; border:none; padding:0;">
      <span>&#127757; ${tour.states?.length || 0} State${tour.states?.length > 1 ? 's' : ''}</span>
    </div>
    <div class="day-row" style="background:none; border:none; padding:0;">
      <span>&#128205; ${tour.states?.reduce((acc: number, s: any) => acc + (s.cities?.length || 0), 0) || 0} Cities</span>
    </div>
    <div class="day-row" style="background:none; border:none; padding:0;">
      <span>&#127966; ${tour.tourType || 'Group Tour'}</span>
    </div>
  </div>

  <!-- ==================== PRICE CIRCLE ==================== -->
  <div class="price-circle">
    <p style="margin:0; font-size:13px;">All inclusive Super Deal Price</p>
    <span>&#8377;${tour.baseJoiningPrice?.toLocaleString('en-IN') || '0'}*</span>
    <p style="margin:4px 0; font-size:12px;">per person on twin sharing</p>
    <p style="margin:4px 0; font-size:11px; color:#666;">*Taxes extra | GST 5% applicable</p>
  </div>

  <hr/>

  <!-- ==================== TOUR DETAILS SECTION ==================== -->
  <div class="tour-main">
    <h2>${tour.title}</h2>

    <div class="tour-meta-row">
      <span>&#128197; ${tour.days} Days / ${tour.nights} Nights</span>&nbsp;&nbsp;
      <span>&#127757; ${tour.states?.length || 0} States</span>&nbsp;&nbsp;
      <span>&#127966; ${tour.tourType || 'Group Tour'}</span>
    </div>

    <div class="price-row">
      <div class="price-details">
        <p style="margin:0; font-size:13px;">All Inclusive Price</p>
        <h3 style="margin:5px 0; color:#2b4fa2;">
          &#8377;${tour.baseJoiningPrice?.toLocaleString('en-IN')}* 
          <span class="small">/ per person on twin sharing</span>
        </h3>
        <p class="small">*Taxes extra | Full Package: &#8377;${tour.baseFullPackagePrice?.toLocaleString('en-IN') || 'N/A'}</p>
      </div>
    </div>

    ${
      tour.route
        ? `
    <div class="info-strip">
      <strong>Route:</strong> ${tour.route}
    </div>`
        : ''
    }
  </div>

  <hr/>

  <!-- ==================== STATES & CITIES ==================== -->
  <div class="state-section">
    <h4>STATE &amp; CITIES COVERED</h4>
    ${statesCities}
  </div>

  <hr/>

  <!-- ==================== WHY TRAVEL ==================== -->
  ${
    whyTravelItems
      ? `
  <div class="why-travel">
    <h3>WHY TRAVEL WITH US</h3>
    <ul>${whyTravelItems}</ul>
  </div>
  <hr/>`
      : ''
  }

  <!-- ==================== ITINERARY ==================== -->
  <div class="itinerary">
    <h3>TOUR ITINERARY</h3>
    ${itineraryDays}
  </div>

  <hr/>

  <!-- ==================== DEPARTURE DATES ==================== -->
  <div class="section-title">MORE DATES &amp; DEPARTURE CITIES</div>
  ${departureSections}

  <div class="note-small">*The highlighted date shows the lowest available price</div>

  <div class="footer-note">
    NOTE: Tour prices may vary as per your travel date and departure city.
    For specific pricing, please contact us on ${phone} or ${email}
  </div>

  <hr/>

  <!-- ==================== FLIGHTS ==================== -->
  ${
    flightRows
      ? `
  <div class="section-title">FLIGHT DETAILS</div>
  <div class="table-box">
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Airline</th>
          <th>Departure Date &amp; Time</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>${flightRows}</tbody>
    </table>
  </div>`
      : ''
  }

  <!-- ==================== ACCOMMODATION ==================== -->
  <div class="section-title">ACCOMMODATION DETAILS</div>
  <div class="table-box">
    <table>
      <thead>
        <tr>
          <th>City - Country</th>
          <th>Hotel</th>
          <th>Check In - Check Out</th>
        </tr>
      </thead>
      <tbody>${accommodationRows}</tbody>
    </table>
  </div>

  <!-- ==================== REPORTING / DROPPING ==================== -->
  ${
    reportingRows
      ? `
  <div class="section-title">REPORTING &amp; DROPPING POINTS</div>
  <div class="table-box">
    <table>
      <thead>
        <tr>
          <th>Guest Type</th>
          <th>Reporting Point</th>
          <th>Dropping Point</th>
        </tr>
      </thead>
      <tbody>${reportingRows}</tbody>
    </table>
  </div>`
      : ''
  }

  <!-- ==================== INCLUSIONS ==================== -->
  <h2>Inclusions</h2>
  <div class="description">${tour.tourInclusions || 'Not specified'}</div>

  <!-- ==================== EXCLUSIONS ==================== -->
  <h2>Exclusions</h2>
  <div class="description">${tour.tourExclusions || 'Not specified'}</div>

  <!-- ==================== TOUR PREPARATION ==================== -->
  ${
    tour.tourPrepartion
      ? `
  <h2>Tour Preparation</h2>
  <div class="description">${tour.tourPrepartion}</div>`
      : ''
  }

  <!-- ==================== NEED TO KNOW ==================== -->
  ${
    tour.needToKnow
      ? `
  <h2>Need to Know</h2>
  <div class="description">${tour.needToKnow}</div>`
      : ''
  }

  <!-- ==================== CANCELLATION POLICY ==================== -->
  ${
    tour.cancellationPolicy
      ? `
  <h2>Cancellation Policy &amp; Payment Terms</h2>
  <div class="description">${tour.cancellationPolicy}</div>`
      : ''
  }

  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="line"></div>
    <div class="footer-content">
      <div>
        ${
          companyLogo
            ? `<img src="${companyLogo}" alt="${companyName}" width="80" height="80" style="object-fit:contain;" />`
            : `<h2 style="margin:0; color:#2b4fa2;">${companyName}</h2>`
        }
        <p style="margin:4px 0; font-size:13px;">
          Explore the world with expert, caring and professional Tour Managers.
          Contact us on toll-free <strong>${phone}</strong> or 
          <strong>${email}</strong>
        </p>
      </div>
    </div>
    <div class="line"></div>
    <div class="bottom-row">
      <p>Travel. Explore. Celebrate Life with ${companyName}.</p>
      <p>${copyrightText}</p>
    </div>
  </footer>

</div>
</body>
</html>
  `;
};
