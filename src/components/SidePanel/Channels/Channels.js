import React, { Component } from 'react'
import { Form, Icon, Input, Menu, Modal, Button } from 'semantic-ui-react';
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../../store/actions/index';

class Channels extends Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        activeChannel: '',
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true,
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({
                channels: loadedChannels
            }, () => this.setFirstChannel())
        })
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({
            firstLoad: false,
        })
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createBy: {
                name: user.displayName,
                avatar: user.photoURL,
            }
        }

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({
                    channelName: '',
                    channelDetails: ''
                })
                this.closeModal();
                alert("Channel added!")
            })
            .catch(err => {
                console.error(err);
            })
    }

    handleSubmit = e => {
        e.preventDefault();

        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }

    setActiveChannel = channel => {
        this.setState({
            activeChannel: channel.id
        })
    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    openModal = () => this.setState({ modal: true })

    closeModal = () => this.setState({ modal: false })

    render() {
        const { channels, modal } = this.state;
        return (
            <>
                <Menu.Menu style={{ paddingBottom: '2em' }} >
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                    </span>{" "}
                    ({
                            channels.length
                        }) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {
                        this.displayChannels(channels)
                    }
                </Menu.Menu>

                {/* {Add channel Modal} */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input fluid label="Name of Channel" name="channelName" onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Field>
                                <Input fluid label="About the Channel" name="channelDetails" onChange={this.handleChange} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </>
        )
    }
}



export default connect(null, { setCurrentChannel })(Channels);