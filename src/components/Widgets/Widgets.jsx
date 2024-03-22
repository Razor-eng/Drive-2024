import './Widgets.css'

const Widgets = () => {
    const WidgetItems = [
        {
            image: './calendar.png',
            label: "Calendar"
        },
        {
            image: './keep.png',
            label: "Keep"
        },
        {
            image: './tasks.png',
            label: "Tasks"
        },
        {
            image: './contacts.png',
            label: "Contacts"
        },
    ]

    return (
        <div className='widgets'>
            {WidgetItems.map((item, index) => (
                <div key={index} className="widget">
                    <div className='widget_image'>
                        <img src={item.image} alt="widget" />
                    </div>
                    <span>{item.label}</span>
                </div>
            ))}
            <div className='widget' style={{ marginTop: '10px' }}>
                <div className="widget_image">
                    <img src="/add.png" alt="add" />
                </div>
                <span>Add-ons</span>
            </div>
        </div>
    )
}

export default Widgets