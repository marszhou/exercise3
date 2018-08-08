import React, { Component } from 'react'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploads: [],
      images: []
    }
    this.file = React.createRef()
  }

  handleFileChange = () => {
    this.setState({
      uploads: [...this.file.current.files].map(window.URL.createObjectURL)
    })
  }

  handleProgress = e => {
    console.log('上传:' + Math.round((e.loaded / e.total) * 1000) / 10 + '%')
  }

  handleUpload = () => {
    const data = new FormData()
    data.append('foo', 'bar')
    for (let i = 0; i < this.file.current.files.length; i++) {
      data.append('images[]', this.file.current.files[i])
    }

    axios
      .put('/upload', data, { onUploadProgress: this.handleProgress })
      .then(({ data }) => {
        this.form.reset()
        this.setState({
          images: [...this.state.images, ...data],
          uploads: []
        })
      })
      .catch(function(err) {
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <form ref={form => this.form = form}>
          <input
            type="file"
            ref={this.file}
            accept="image/*"
            multiple
            onChange={this.handleFileChange}
          />
          <button type="button" onClick={this.handleUpload}>
            upload
          </button>
        </form>

        {this.state.uploads.length > 0 ? (
          <div>
            <p>待上传</p>
            {this.state.uploads.map((data, i) => (
              <img
                key={i}
                src={data}
                style={{ maxWidth: 300, maxHeight: 300, border: '5px solid lightgray' }}
              />
            ))}
          </div>
        ) : null}

        {this.state.images.length > 0 ? (
          <div>
            <p>已上传</p>
            {this.state.images.map((url, i) => (
              <img
                key={i}
                src={'http://localhost:8080' + url}
                style={{ maxWidth: 300, maxHeight: 300, border: '5px solid green' }}
              />
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}

export default App
