import React, { Component } from 'react';
import {USER_CONNECTED} from '../actions/event';
import '../styles/sidebar/SideBar.css'
import{ TiThMenuOutline} from 'react-icons/ti';
import {FiLogOut} from 'react-icons/fi';
import { IoIosPersonAdd } from "react-icons/io";
class SideBar extends Component {
    constructor(props){
        super(props)
        this.state={
            receiver:"",
            showUserList:false,
            ConnecttingUser:[]
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    componentDidMount(){
      this.getConnectingList();
    }
    handleChange(e){
        this.setState({[e.target.name]:e.target.value})
        //console.log(this.state.receiver)
    }
    handleSubmit(e){
        e.preventDefault();
        //console.log(this.state.receiver);
        this.props.openPrivateChat(this.state.receiver);
        this.setState({receiver:""})
    }
    getConnectingList(){
      const {socket}= this.props;
      socket.on(USER_CONNECTED,(connectedUser)=>{
        let newConnectingUserList= Object.entries(connectedUser);
        this.setState({ConnecttingUser:[...newConnectingUserList]})
      })
    }
    render() {
        //console.log(this.state.ConnecttingUser);
        const {
          user,
          logout,
          chats,
          activeChat,
          setActivechat,
        } = this.props;
        
        const {ConnecttingUser} = this.state;
        return (
          <div className="Sidebar-container">
            <div className="Sidebar-heading">
              <div className="App-name">Cool Chat App</div>
              <div className="heading-menu">
                <TiThMenuOutline />
              </div>
            </div>
            <div className="Sidebar-option">
              <div
                className="Show-chat-List"
                onClick={() => {
                  this.setState({ showUserList: false });
                }}
              >
                Chat List
              </div>
              <div
                className="Show-online-user"
                onClick={() => {
                  this.setState({ showUserList: true });
                }}
              >
                Online User
              </div>
            </div>
            <div className="Sidebar-search">
              <form onSubmit={this.handleSubmit} className="Search-form">
                <input
                  className="Search-input"
                  placeholder="Search for connecting user"
                  type="text"
                  name="receiver"
                  autoComplete="off"
                  value={this.state.receiver}
                  onChange={this.handleChange}
                />
                <button
                  className="plus"
                  type="submit"
                  disabled={this.state.receiver.length < 1}
                >
                  <IoIosPersonAdd />
                </button>
              </form>
            </div>
            <div className="Sidebar-list">
              {this.state.showUserList ? (
                <div className="Sidebar-user-list">
                    {ConnecttingUser.map((cnuser) => {
                      if(cnuser[0]!==user.name){
                        return (
                          <div
                            onClick={()=>{
                              this.setState({showUserList:false})
                              this.props.openPrivateChat(cnuser[0]);
                            }
                          }
                          key={cnuser[1].id}
                          className="UserList-UserItem"
                          >
                          {cnuser[0]}
                          </div>
                          )
                      }
                    })
                    }
                </div>
              ) : (
                <div
                  className="Sidebar-chat-list" /*ref="users"*/
                  onClick={(e) => {
                    e.target === this.refs.user && setActivechat(null);
                  }}
                >
                  {chats.map((chat) => {
                    if (chat.name) {
                      //console.log(chat.users);
                      const lastMessage =
                        chat.messages[chat.messages.length - 1];
                      const conversation =
                        chat.users.find((name) => {
                          return name !== user.name;
                        }) || "Community";
                      //console.log(conversation);
                      const className =
                        activeChat && activeChat.id === chat.id ? "active" : "";
                      return (
                        <div
                          key={chat.id}
                          className={`user ${className}`}
                          onClick={() => setActivechat(chat)}
                        >
                          <div className="user-ava">
                            {conversation[0].toUpperCase()}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{conversation}</div>
                            {lastMessage && (
                              <div className="lastMessage">
                                {lastMessage.message}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>

            <div className="Sidebar-current-user">
              <div className="current-user-name">{user.name}</div>
              <div
                id="logout"
                onClick={() => {
                  logout();
                }}
              >
                <FiLogOut />
              </div>
            </div>
          </div>
        );
    }
}

export default SideBar;