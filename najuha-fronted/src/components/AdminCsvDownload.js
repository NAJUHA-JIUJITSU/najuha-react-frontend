import React, { useState } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import { Cookies } from "react-cookie";

const backBaseUrl = process.env.REACT_APP_REDIRECT_URI

const AdminCsvDownload = () => {
  const [csvData, setCsvData] = useState([]);
  const [competitionId, setCompetitionId] = useState("");
  const cookies = new Cookies();
  const xAccessToken = cookies.get("x-access-token");

  const getCsvData = async () => {
    const res = await axios({
      method: "get",
      headers: {
        "x-access-token": xAccessToken,
      },
      url:
        backBaseUrl +
        "/admin/competitions/" +
        competitionId +
        "/competitionApplications/csv",
    });
    setCsvData(res.data.result);
  };

  const handleChange = (e) => {
    setCompetitionId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getCsvData();
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="competitionId"
            value={competitionId}
            onChange={handleChange}
          />
          <button type="submit">대회 신청 목록 불러오기</button>
        </form>
      </div>
      <CSVLink data={csvData} filename="applicationList.csv">
        Download me
      </CSVLink>
      <div>{csvData}</div>
    </div>
  );
};

export default AdminCsvDownload;