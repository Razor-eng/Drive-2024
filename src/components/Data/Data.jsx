import { ArrowDownward, ArrowDropDown, Check, Close, GetAppOutlined, GridOn, InfoOutlined, List, MoreVert } from '@material-ui/icons'
import './Data.css'
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { Avatar } from '@material-ui/core';

// eslint-disable-next-line react/prop-types
const Data = ({ selected, user }) => {
    const [grid, setgrid] = useState(false);
    const [files, setFiles] = useState([]);
    const [close, setClose] = useState(false);
    const [weekData, setWeekData] = useState([])
    const [monthData, setMonthData] = useState([])
    const [yearData, setYearData] = useState([])
    const [totalStorage, setTotalStorage] = useState(0);

    const checkUser = (file) => {
        // eslint-disable-next-line react/prop-types
        return file.data.userEmail === user.email;
    }
    const otherUser = (file) => {
        // eslint-disable-next-line react/prop-types
        return file.data.userEmail !== user.email;
    }
    const weekUserData = (file) => {
        // eslint-disable-next-line react/prop-types
        return getDate(new Date().toLocaleDateString(), new Date(file.data?.timestamp?.seconds * 1000).toLocaleDateString()) < 7;
    }
    const monthUserData = (file) => {
        // eslint-disable-next-line react/prop-types
        let date = getDate(new Date().toLocaleDateString(), new Date(file.data?.timestamp?.seconds * 1000).toLocaleDateString());
        return date > 7 && date < 365;
    }
    const yearUserData = (file) => {
        // eslint-disable-next-line react/prop-types
        let date = getDate(new Date().toLocaleDateString(), new Date(file.data?.timestamp?.seconds * 1000).toLocaleDateString());
        return date > 365;
    }

    useEffect(() => {
        if (selected === 'Home' || selected === 'Recent') {
            db.collection("myfiles").onSnapshot(snapshot => {
                setFiles(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })));
            });
        }
        if (selected === 'My Drive' || selected === 'Storage') {
            db.collection("myfiles").onSnapshot(snapshot => {
                setFiles(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })).filter(checkUser));
            });
        }
        if (selected === 'Shared with me') {
            db.collection("myfiles").onSnapshot(snapshot => {
                setFiles(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })).filter(otherUser));
            });
        }
        if (selected === 'Recent') {
            db.collection("myfiles").onSnapshot(snapshot => {
                setWeekData(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })).filter(weekUserData));
            });
            db.collection("myfiles").onSnapshot(snapshot => {
                setMonthData(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })).filter(monthUserData));
            });
            db.collection("myfiles").onSnapshot(snapshot => {
                setYearData(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                })).filter(yearUserData));
            });
        }
        if (selected === 'Storage') {
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    return (
        <div className='data'>
            <div className="data_header">
                <div className="data_headerLeft">
                    <p>{selected}</p>
                    {selected === "My Drive" &&
                        <ArrowDropDown />
                    }
                </div>
                <div className="data_headerRight">
                    {((selected === 'Home') || (selected === 'My Drive') || (selected === 'Shared with me') || (selected === 'Recent') || (selected === 'Starred') || (selected === 'Trash')) && (
                        <div className='data_type'>
                            <div className='grid_type' style={{ borderRadius: "12px 0 0 12px", backgroundColor: `${!grid ? "#b3d7ef" : ""}` }} onClick={() => setgrid(false)}>
                                {!grid &&
                                    <div className='hideSvg'>
                                        <Check />
                                    </div>
                                }
                                <List style={{ width: "30px", margin: "5px" }} />
                            </div>
                            <div className="line"></div>
                            <div className='grid_type' style={{ borderRadius: "0px 12px 12px 0px", backgroundColor: `${grid ? "#b3d7ef" : ""}` }} onClick={() => setgrid(true)}>
                                {grid &&
                                    <div className='hideSvg'>
                                        <Check />
                                    </div>
                                }
                                <GridOn style={{ width: "30px", margin: "5px" }} />
                            </div>
                        </div>
                    )}
                    {
                        (selected === 'Storage') && <h5 style={{ fontWeight: "500", color: '#0C52C2' }}>Backups</h5>
                    }
                    <div className='hideSvg'>
                        <InfoOutlined style={{ marginLeft: "15px" }} />
                    </div>
                </div>
            </div>

            {((selected === "My Drive") || (selected === "Shared with me") || (selected === 'Recent') || (selected === 'Starred') || (selected === 'Trash') || (selected === 'Storage')) &&
                <div className='data_headerMiddle'>
                    <div className='data_headerMiddleItems'>
                        <div>Type <ArrowDropDown /></div>
                        {
                            !((selected === 'Trash') || (selected === 'Storage')) && <div>People <ArrowDropDown /></div>
                        }
                        <div>Modified <ArrowDropDown /></div>
                    </div>
                </div>
            }

            {(selected === "Shared with me") && (
                !close && (
                    <div className='computers' style={{ padding: '16px 16px', marginTop: '20px' }}>
                        <div className='left'>
                            <InfoOutlined style={{ color: "#041E49" }} />
                            <div className='computers_info' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '500' }}>Better spam filters </h3>
                                <p>
                                    Now Drive automatically moves suspicious files shared with you to spam. You can still report spam on your own.
                                    <span>
                                        Learn more
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div onClick={() => setClose(true)}>
                            <Close style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                )
            )}
            {(selected === "Spam") && (
                <div className='computers' style={{ padding: '16px 16px', marginTop: '4px', background: '#E3E3E3' }}>
                    <div className='left'>
                        <div className='computers_info' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                            <p>
                                File in spam {`won't`} appear anywhere else in Drive. Files are permanently removed after 30 days.
                            </p>
                        </div>
                    </div>
                </div>
            )
            }

            {
                ((selected === 'Recent')) && (
                    <div className="data_content">
                        {grid ? (
                            <>
                                {
                                    weekData !== null && (
                                        <>
                                            <div style={{ marginTop: '20px' }}>
                                                <h5 style={{ marginLeft: '20px', fontWeight: '500', fontSize: '15px' }}>Earlier this Week</h5>
                                            </div>
                                            <div className="data_grid" style={{ marginTop: '2px' }}>
                                                {weekData.map((file) => (
                                                    <div key={file.id}>
                                                        <div className="data_file">
                                                            <div className='data_file' style={{ flexDirection: 'row' }}>
                                                                <GetAppOutlined style={{ color: 'gray' }} />
                                                                <h2 style={{ maxWidth: '80%', marginLeft: '12px' }}>{file.data?.filename}</h2>
                                                                <MoreVert style={{ color: 'gray' }} />
                                                            </div>
                                                            <div className='data_fileIcon' style={{ marginBottom: '10px' }}>
                                                                <img src={file.data?.fileURL} alt="image" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    monthData !== null && (
                                        <>
                                            <div style={{ marginTop: '20px' }}>
                                                <h5 style={{ marginLeft: '20px', fontWeight: '500', fontSize: '15px' }}>Earlier this Month</h5>
                                            </div>
                                            <div className="data_grid" style={{ marginTop: '2px' }}>
                                                {monthData.map((file) => (
                                                    <div key={file.id}>
                                                        <div className="data_file">
                                                            <div className='data_file' style={{ flexDirection: 'row' }}>
                                                                <GetAppOutlined style={{ color: 'gray' }} />
                                                                <h2 style={{ maxWidth: '80%', marginLeft: '12px' }}>{file.data?.filename}</h2>
                                                                <MoreVert style={{ color: 'gray' }} />
                                                            </div>
                                                            <div className='data_fileIcon' style={{ marginBottom: '10px' }}>
                                                                <img src={file.data?.fileURL} alt="image" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    yearData !== null && (
                                        <>
                                            <div style={{ marginTop: '20px' }}>
                                                <h5 style={{ marginLeft: '20px', fontWeight: '500', fontSize: '15px' }}>Earlier this Year</h5>
                                            </div>
                                            <div className="data_grid" style={{ marginTop: '2px' }}>
                                                {yearData.map((file) => (
                                                    <div key={file.id}>
                                                        <div className="data_file">
                                                            <div className='data_file' style={{ flexDirection: 'row' }}>
                                                                <GetAppOutlined style={{ color: 'gray' }} />
                                                                <h2 style={{ maxWidth: '80%', marginLeft: '12px' }}>{file.data?.filename}</h2>
                                                                <MoreVert style={{ color: 'gray' }} />
                                                            </div>
                                                            <div className='data_fileIcon' style={{ marginBottom: '10px' }}>
                                                                <img src={file.data?.fileURL} alt="image" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )
                                }
                            </>
                        ) : (
                            <div className="data_list">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Owner</th>
                                            <th>Last Modified</th>
                                            <th>File Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            weekData !== null && (
                                                <>
                                                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                                        <h5 style={{ fontWeight: '400', fontSize: '16px', marginLeft: '10px' }}>Earlier this Week</h5>
                                                    </div>
                                                    {weekData.map((file) => {
                                                        return (
                                                            <tr key={file.id} style={{ borderTop: '1px solid lightGray' }}>
                                                                <td>{file.data.filename}</td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                                        <Avatar src={file.data.photoURL} />
                                                                        {file.data?.userName}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                        <p className='hideSvg'>You opened</p>
                                                                        <p className='hideSvg' style={{ fontSize: '30px', marginBottom: '12px' }}>.</p>
                                                                        <p>{new Date(file.data.timestamp?.seconds * 1000).toDateString()}</p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        {formatBytes(file.data.size)}
                                                                        <MoreVert />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            )
                                        }
                                        {
                                            monthData !== null && (
                                                <>
                                                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                                        <h5 style={{ fontWeight: '400', fontSize: '16px', marginLeft: '10px' }}>Earlier this Month</h5>
                                                    </div>
                                                    {monthData.map((file) => {
                                                        return (
                                                            <tr key={file.id} style={{ borderTop: '1px solid lightGray' }}>
                                                                <td>{file.data.filename}</td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                                        <Avatar src={file.data.photoURL} />
                                                                        {file.data?.userName}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                        <p className='hideSvg'>You opened</p>
                                                                        <p className='hideSvg' style={{ fontSize: '30px', marginBottom: '12px' }}>.</p>
                                                                        <p>{new Date(file.data.timestamp?.seconds * 1000).toDateString()}</p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        {formatBytes(file.data.size)}
                                                                        <MoreVert />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            )
                                        }
                                        {
                                            yearData !== null && (
                                                <>
                                                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                                        <h5 style={{ fontWeight: '400', fontSize: '16px', marginLeft: '10px' }}>Earlier this Year</h5>
                                                    </div>
                                                    {yearData.map((file) => {
                                                        return (
                                                            <tr key={file.id} style={{ borderTop: '1px solid lightGray' }}>
                                                                <td>{file.data.filename}</td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                                        <Avatar src={file.data.photoURL} />
                                                                        {file.data?.userName}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                        <p className='hideSvg'>You opened</p>
                                                                        <p className='hideSvg' style={{ fontSize: '30px', marginBottom: '12px' }}>.</p>
                                                                        <p>{new Date(file.data.timestamp?.seconds * 1000).toDateString()}</p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        {formatBytes(file.data.size)}
                                                                        <MoreVert />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )
            }

            {
                ((selected === 'Home') || (selected === 'My Drive') || (selected === 'Shared with me')) && (
                    <div className="data_content">
                        {grid ? (
                            <div className="data_grid">
                                {files.map((file) => {
                                    return (
                                        <div key={file.id} className="data_file">
                                            <h2>{file.data?.filename}</h2>
                                            <div className='data_fileIcon'>
                                                <img src={file.data?.fileURL} alt="image" />
                                                <span>{formatBytes(file.data?.size)}</span>
                                            </div>
                                            <div className='data_items'>
                                                <Avatar src={file.data?.photoURL} />
                                                <div >
                                                    <p className='lastSeen'>You opened</p>
                                                    <p style={{ fontSize: '30px', marginBottom: '12px' }} className='lastSeen'>.</p>
                                                    <p>{new Date(file.data?.timestamp?.seconds * 1000).toDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="data_list">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Owner</th>
                                            <th>Last Modified</th>
                                            <th>File Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {files.map((file) => {
                                            return (
                                                <tr key={file.id}>
                                                    <td>{file.data.filename}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                            <Avatar src={file.data.photoURL} />
                                                            {file.data?.userName}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <p className='hideSvg'>You opened</p>
                                                            <p className='hideSvg' style={{ fontSize: '30px', marginBottom: '12px' }}>.</p>
                                                            <p>{new Date(file.data.timestamp?.seconds * 1000).toDateString()}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            {formatBytes(file.data.size)}
                                                            <MoreVert />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )
            }

            {
                ((selected === 'Storage')) && (
                    <div className='storage_progress'>
                        <div className="storageprogress_bar">
                            <p><span>{formatBytes(totalStorage)}</span> of 15GB used</p>
                            <progress size="tiny" value={((convertToGB(totalStorage) * 100) / 15).toFixed(3)} max="15" />
                        </div>
                        <div className='storage_progressBtn'>
                            <button>Get more storage</button>
                            <button>Clean up space</button>
                        </div>
                    </div>
                )
            }

            {
                ((selected === 'Storage')) && (
                    <div className="data_storage">
                        <div className="data_storagelist">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Files using Drive storage</th>
                                        <th style={{ display: 'flex', alignItems: 'center' }}>Storage used <ArrowDownward style={{ fontSize: '20px', color: 'gray' }} /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file) => (
                                        <tr key={file.id}>
                                            <td>{file.data.filename}</td>
                                            <td>{formatBytes(file.data.size)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            {
                ((selected === 'Computers') || (selected === 'Starred') || (selected === 'Spam') || (selected === 'Trash')) && (
                    <div className='computersSection'>
                        {(selected === 'Computers') &&
                            !close && (
                                <div className='computers'>
                                    <div className='left'>
                                        <InfoOutlined style={{ color: "#041E49" }} />
                                        <div className='computers_info'>
                                            <h3>Changes will automatically sync.</h3>
                                            <p>
                                                If you add, edit, move, or delete files in folders currently syncing with Google Drive, those changes will also happen on your computer.
                                                <span>
                                                    Learn more
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div onClick={() => setClose(true)}>
                                        <Close style={{ color: '#0842A0', cursor: "pointer" }} />
                                    </div>
                                </div>
                            )}
                        <div className='computersImage' style={{ marginTop: `${((selected === 'Spam') || (selected === 'Starred') || (selected === 'Trash')) ? '100px' : ''}` }}>
                            <img src={`${selected === 'Computers' ? "/images/computers.svg" : ""} ${selected === 'Starred' ? "/images/starred.svg" : ''} ${selected === 'Spam' ? "/images/spam.svg" : ''} ${selected === 'Trash' ? "/images/trash.svg" : ''}`} alt="computers" />
                            <h3>
                                {(selected === 'Computers') && "No folders syncing with Drive"}
                                {(selected === 'Starred') && "No starred files"}
                                {(selected === 'Spam') && "Your spam is empty"}
                                {(selected === 'Trash') && "Nothing in trash"}
                            </h3>
                            <p>
                                {(selected === 'Computers') &&
                                    "Folders on your computer that you sync with Drive using Drive for desktop will show up here."
                                }
                                {(selected === 'Starred') &&
                                    "Add stars to things that you want to easily find later"
                                }
                                {(selected === 'Spam') &&
                                    "Files in spam won't appear anywhere else in Drive. Files are permanently removed after 30 days."
                                }
                                {(selected === 'Trash') &&
                                    "Move items you don't need to trash. Items in trash will be deleted forever after 30 days."
                                }
                                {((selected === 'Computers') || (selected === 'Trash')) &&
                                    <span> Learn more</span >
                                }
                            </p>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default Data

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

function getDate(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
