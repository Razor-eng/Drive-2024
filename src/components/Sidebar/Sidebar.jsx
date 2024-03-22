import { Add, Close, CloudQueue, DeleteOutline, DevicesOutlined, ErrorOutline, FolderShared, HomeOutlined, PeopleAltOutlined, QueryBuilderOutlined, StarBorderOutlined } from '@material-ui/icons'
import './Sidebar.css'
import { useEffect, useState } from 'react';
import { Modal } from '@material-ui/core';
import Loading from '../Loading/Loading';
import firebase from 'firebase/compat/app';
import { db, storage } from '../../firebase';

// eslint-disable-next-line react/prop-types
const Sidebar = ({ selected, setSelected, user }) => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [totalStorage, setTotalStorage] = useState(0);
    const [close, setClose] = useState(false);

    const SidebarItems = [
        {
            icon: <HomeOutlined />,
            label: "Home"
        },
        {
            icon: <FolderShared />,
            label: "My Drive"
        },
        {
            icon: <DevicesOutlined />,
            label: "Computers"
        },
        {
            icon: <PeopleAltOutlined />,
            label: "Shared with me"
        },
        {
            icon: <QueryBuilderOutlined />,
            label: "Recent"
        },
        {
            icon: <StarBorderOutlined />,
            label: "Starred"
        },
        {
            icon: <ErrorOutline />,
            label: "Spam"
        },
        {
            icon: <DeleteOutline />,
            label: "Trash"
        },
        {
            icon: <CloudQueue />,
            label: "Storage"
        },
    ]

    const handleClose = () => {
        setOpen(false);
    }
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }
    const handleUpload = (e) => {
        e.preventDefault();
        setUploading(true);
        storage.ref(`files/${file.name}`).put(file).then(snapshot => {
            storage.ref("files").child(file.name).getDownloadURL().then(url => {
                db.collection("myfiles").add({
                    // eslint-disable-next-line react/prop-types
                    userName: user.name,
                    // eslint-disable-next-line react/prop-types
                    photoURL: user.photoURL,
                    // eslint-disable-next-line react/prop-types
                    userEmail: user.email,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    filename: file.name,
                    fileURL: url,
                    size: snapshot._delegate.bytesTransferred
                });
                setUploading(false);
                setFile(null);
                setOpen(false);
            });
        });
    }

    useEffect(() => {
        let storage = 0;
        db.collection("myfiles").onSnapshot(snapshot => {
            snapshot.docs.map((doc) => {
                // eslint-disable-next-line react/prop-types
                if (doc.data().userEmail === user.email) {
                    storage += doc.data().size;
                    setTotalStorage(storage);
                }
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let storage = 0;
        db.collection("myfiles").onSnapshot(snapshot => {
            snapshot.docs.map((doc) => {
                // eslint-disable-next-line react/prop-types
                if (doc.data().userEmail === user.email) {
                    storage += doc.data().size;
                    setTotalStorage(storage);
                }
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleUpload])

    return (
        <>
            <Modal open={open} onClose={handleClose} >
                <div className="modal">
                    <form>
                        <div className="modalHead">
                            <h3>Select a file to upload!</h3>
                            <Close onClick={handleClose} />
                        </div>

                        <div className="modalBody">
                            {
                                uploading ? (
                                    <p className='uploading'>
                                        <Loading />
                                        Uploading
                                        <span>Please wait...</span>
                                    </p>
                                ) : (
                                    <>
                                        <input type="file" onChange={handleChange} />
                                        <input type="submit" className='modalButton' onClick={handleUpload} />
                                    </>
                                )
                            }
                        </div>
                    </form>
                </div>
            </Modal>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <div className='sidebar'>
                    <div className="sidebar_btn">
                        <button onClick={() => setOpen(true)}>
                            <Add />
                            <span>New</span>
                        </button>
                    </div>

                    <div className="sidebar_options">
                        {SidebarItems.map((item, index) => (
                            <div
                                key={index}
                                className={`sidebar_option ${item.label === selected ? "active" : ""}`}
                                style={{ marginTop: `${index % 3 === 0 && "12px"}` }}
                                onClick={() => setSelected(item.label)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="progress_bar">
                        <progress size="tiny" value={((convertToGB(totalStorage) * 100) / 15).toFixed(3)} max="15" />
                        <span>{formatBytes(totalStorage)} of 15 GB Used</span>
                    </div>
                </div>
                {
                    !close && (
                        <div className='download'>
                            <div className='downloadBtn'>
                                <h3>Get Drive for desktop</h3>
                                <button>Download</button>
                            </div>
                            <Close style={{ cursor: 'pointer' }} onClick={() => setClose(true)} />
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Sidebar

function convertToGB(bytes) {
    let gbValue = (bytes / (1000 * 1000 * 1000));
    return gbValue;
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}