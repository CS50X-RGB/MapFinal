import React, { useEffect, useState } from "react";
import "./navbar.css";
import ProfileAxios from "../utils/Db/getMyProfile";
import handleLogout from "../utils/Db/Logout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../cart/authSlice";
import { Card, CardBody,Avatar, Image, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,Link } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";

export default function Navbar({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenDriver, onOpen: onOpenDriver, onOpenChange: onOpenChangeDriver, onClose: onCloseDriver } = useDisclosure();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ProfileAxios();
       console.log(response,"Response in navbar");
        const userData = response?.data?.user;
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const logoutHandler = async () => {
    try {
      await handleLogout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex flex-row justify-center w-full items-center h-full">
       <Spinner label="Fetching Prices" /> 
    </div>;
  }

  return (
    <>
      {isAuth ? (
        <Card className="flex bg-black flex-end font-mono items-center">
          <CardBody className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-around">
            <div className="flex flex-row items-center gap-4 justify-around w-full md:w-fit">
              <Link href="/profile" className="text-xl text-text">Welcome {user?.name}</Link>
              <Avatar
                radius="full"
                size="lg" 
                src={user?.profilePic}
                alt="profilepic"
              />
            </div>
            {children}
            <Button
              onPress={onOpen}
              className="bg-text text-back px-3 py-1 rounded-md"
            >
              Logout
            </Button>
          </CardBody>
        </Card>

      ) : null}
      <Modal
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="bg-back text-text font-mono"
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-bold">Logout</ModalHeader>
              <ModalBody>
                <p>
                  You Want to Logout ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={logoutHandler}>
                  Logout
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        placement="center"
        isOpen={isOpenDriver}
        onOpenChange={onOpenChangeDriver}
        className="bg-back text-text font-mono"
        onClose={onCloseDriver}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-bold">Switch On Driver Mode?</ModalHeader>
              <ModalBody>
                <p>
                  You Want to Logout ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={logoutHandler}>
                  Switch On
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
