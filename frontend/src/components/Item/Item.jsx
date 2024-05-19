import { Link } from 'react-router-dom';

const Item = (props) => {
    const formattedPrice = Number(props.price).toFixed(2);

    return (
        <div data-aos='zoom-in'>
            <Link to={`/product/${props.id}`}>
                <img src={props.image} alt="" className={props.className} />
            </Link>
            <div className="mt-2">
                <p className="font-semibold uppercase line-clamp-2">{props.name}</p>
                {props.price && <span className="text-sm text-gray-500">${formattedPrice}</span>}
            </div>
        </div>
    );
};

export default Item;
