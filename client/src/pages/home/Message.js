import moment from 'moment';

import {useAuthState} from "../../context/auth";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const Message = ({message}) => {
    const {user} = useAuthState();
    const sent = message.from === user.username;

    return (
      <OverlayTrigger
          placement={'top'}
          overlay={
              <Tooltip id={message.uuid}>
                  {moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
              </Tooltip>
          }
      >
          <div className={sent ? 'd-flex my-3 ml-auto' : 'd-flex my-3 mr-auto'}>
              <div className={sent
                  ? 'py-2 px-3 rounded-pill bg-primary'
                  : 'py-2 px-3 rounded-pill bg-secondary'
              }>
                  <p className={sent ? 'text-white' : ''}>{message.content}</p>
              </div>
          </div>
      </OverlayTrigger>
    );
};

export default Message;
