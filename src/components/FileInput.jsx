import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

const StyledFileInput = styled.div`
  width: 700px;
  height: 300px;
  padding: 16px;
  border: 2px solid lightGray;
  border-radius: 16px;
  border-style: dashed;
  background-color: ${props => (props.isDragActive ? '#6f00ff' : 'white')};
  display: flex;
  justify-content: center;
  align-items: center;
`

const ImageContainer = styled.div`
  max-width: 700px;
  width: 700px;
  height: 300px;
  border-radius: 16px;
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
    border-radius: inherit;
  }
`

export const FileInput = ({ image, setImage }) => {
  const onDrop = useCallback(
    files => {
      const file = files[0]
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => {
          const image = new Image()
          image.height = 300
          image.title = file.name
          image.src = reader.result

          setImage(image)
        },
        false
      )

      reader.readAsDataURL(file)
    },
    [image, setImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/png',
    onDrop
  })

  return (
    <>
      {image ? (
        <ImageContainer>
          <img src={image.src} alt="Uploaded image" />
        </ImageContainer>
      ) : (
        <StyledFileInput
          isDragActive={isDragActive}
          multiple={false}
          {...getRootProps()}
        >
          <p>Drag and drop or choose from library</p>
          <input {...getInputProps()} />
        </StyledFileInput>
      )}
    </>
  )
}
