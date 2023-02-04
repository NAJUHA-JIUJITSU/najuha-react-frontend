import React, {useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { textAlign } from '@mui/system';

function AdminCompetitionImagePage() {
  const cookies = new Cookies();
  const {id} = useParams();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  const handleUpload= async () => {
    try {
      const formData = new FormData();
      formData.append('competition-poster', file);
      
      const response = await axios.post(`${process.env.REACT_APP_BACK_END_API}/admin/competitions/${id}/posters`, formData, {
        headers: {
          "x-access-token":  cookies.get("x-access-token"),
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      // handle the response here, for example displaying a success message or updating the state
    } catch (error) {
      console.log(error);
      // handle the error here, for example displaying an error message
    }
  }

  return (
    <div style={{textAlign:'center'}}>
      <h1 style={{fontSize:'30px', marginTop:'100px'}}>id:{id} 대회 포스터 등록</h1>
      <img style={{width:'194px', height:'264px'}} src={previewUrl} alt="preview" />
      <div style={{textAlign:'center'}}>
        <input type="file" onChange={handleFileChange} />
        <button style={{width:'100px', height:'80px'}} onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}

export default AdminCompetitionImagePage