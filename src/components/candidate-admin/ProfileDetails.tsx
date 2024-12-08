import React, { useState, ChangeEvent, useEffect, useContext } from 'react';
import Images from '../constant/Images';
import MapComponent from '../reusable/map/MapComponent';
import { UilCheck, UilTimes } from '@iconscout/react-unicons';
import { httpGetWithToken, httpGetWithoutToken, httpPostWithToken } from '../../utils/http_utils';
import { iProfile } from '../../models/profle';
import { iSocial } from '../../models/social';
import { Avatar, Button, Divider, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { AppContext } from '../../global/state';
import DeleteAction from '../confirm_modal';
import { useNavigate } from 'react-router-dom';

const ProfileImageUpload: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser }: any = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const toast = useToast();
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [links, setLinks] = useState<iSocial[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [profile, setProfile] = useState<iProfile>({})
  const [selected, setSelected] = useState<any>(null)
  const [bio, setBio] = useState<any>("")
  const [user_country, setUserCountry] = useState<any>("")
  const [user_state, setUserState] = useState<any>("")
  const [user_city, setUserCity] = useState<any>("")
  const [editing_link, setEditingLink] = useState<any>("")
  const [fullname, setFullname] = useState<any>("")

  const [user_zipcode, setUserZipCode] = useState<any>("")
  const [newLink, setNewLink] = useState<any>("")
  const [newLinkValue, setNewLinkValue] = useState<any>("")
  const [saveLoading, setSaveLoading] = useState(false)
  const [showAddLink, setShowAddLink] = useState(false)

  const {
    isOpen: isOpen,
    onOpen: onOpen,
    onClose: onClose,
  } = useDisclosure();

  const addLink = async () => {
    if (newLink == "" || newLinkValue == "") return;
    if (loading) return;
    setLoading(true)
    const fd = {
      label: newLink,
      value: newLinkValue,
    }
    const resp = await httpPostWithToken("profile/social-add", fd)
    if (resp.status == "success") {
      getProfile()

      toast({
        status: "success",
        title: "Social Media Link Added",
        isClosable: true,
        duration: 5000
      })
      setShowAddLink(false)
      setNewLink("")
      setNewLinkValue("")
    }
    setLoading(false)

  };

  const removeLink = async (id: number) => {
    await httpPostWithToken("profile/social-delete/" + id)
    getProfile()
    toast({
      status: "success",
      title: "Social link deleted",
      isClosable: true,
      duration: 5000
    })
  };
  const updateLink = async (id: number) => {

    const fd = {
      value: editing_link
    }
    await httpPostWithToken("profile/social/" + id, fd)
    toast({
      status: "success",
      title: "Social link updated",
      isClosable: true,
      duration: 5000
    })
  }
  const updateLinkEditing = (id: number, val: string) => {
    let l = links;
    l.forEach(link => {
      if (link.id === id) link.value = val;
    });
    setEditingLink(val)
    setLinks(l)
    // const resp = await httpPostWithToken("profile", fd)
  }
  const getProfile = async () => {
    const res = await httpGetWithToken("profile");
    setProfile(res.data)
    setFullname(res.data.name)
    setBio(res.data.bio)
    setUserCity(res.data.city)
    setUserCountry(res.data.country)
    if (res.data.country !== "") {
      getStates(res.data.country)
    }
    setUserState(res.data.state)
    setUserZipCode(res.data.zip_code)
    setLinks(res.data.social_medias)
    updateUser(res.data)
  }
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelected(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    onOpen()
  };
  const handleImageSave = async () => {
    const fd = new FormData();
    if (saveLoading) return;
    fd.append("file", selected)
    setSaveLoading(true)
    const resp = await httpPostWithToken("profile", fd)
    if (resp.status == "success") {
      toast({
        status: "success",
        title: "Profile updated",
        isClosable: true,
        duration: 5000
      })

      const res = await httpGetWithToken("profile");
      setProfile(res.data)
      updateUser(res.data)
    }
    setImage(null)
    setSaveLoading(false)

  }
  const getCountries = async () => {
    let resp = await httpGetWithoutToken("countries")
    setCountries(resp.data);
  }
  const getStates = async (code: string) => {
    let resp = await httpGetWithoutToken("countries/" + code)
    setStates(resp.data);
  }
  useEffect(() => {
    getProfile()
    getCountries()
  }, [])

  const updateProfile = async () => {
    if (loading) return;
    setLoading(true)

    const fd = {
      country: user_country,
      name: fullname,
      city: user_city,
      state: user_state,
      zip_code: user_zipcode
    }
    const resp = await httpPostWithToken("profile", fd)
    if (resp.status == "success") {
      toast({
        status: "success",
        title: "Profile updated",
        isClosable: true,
        duration: 5000
      })

      const res = await httpGetWithToken("profile");
      setProfile(res.data)
      updateUser(res.data)
    }
    setLoading(false)

  }

  return (
    <section className="px-2 py-8 max-w-[1100px] mx-auto">
      <DeleteAction
        onClose={onClose}
        onFinished={getProfile}
        title='Delete Avatar'
        isOpen={isOpen}
        url={"profile/delete-avatar"}
      />
      <div className="bg-white rounded-2xl py-8 px-[2rem] mt-8">
        <div className="flex items-center flex-wrap gap-4 py-4">
          {
            profile.avatar || image
              ?
              <div className="flex items-center justify-center gap-4">
                <img
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-center bg-no-repeat object-cover"
                  src={image ? image as string : profile.avatar}
                  alt="Profile"
                />
              </div>
              :
              <div className="flex items-center justify-center gap-4">
                <Avatar boxSize={{ base: 16, md: 20 }} >
                </Avatar>
              </div>
          }

          {
            image
              ?
              <>
                <button
                  onClick={handleImageSave}
                  className="text-green-600 font-600 py-2 px-4 rounded border border-green-600"
                >
                  {saveLoading ? "Loading..." : "Save"}
                </button>
                <button
                  onClick={() => setImage(null)}
                  className="text-red-600 font-600 py-2 px-4 rounded border "
                >
                  cancel
                </button>
              </>
              :
              <>
                <label className="cursor-pointer bg-green-100 text-green-600 font-medium py-2 px-4 rounded">
                  Upload new photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {
                  profile.avatar
                  &&
                  <button
                    onClick={handleImageDelete}
                    className="text-pink-600 py-2 px-4 rounded border border-pink-600"
                  >
                    Delete
                  </button>
                }
              </>
          }
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-green-600 text-lg mb-2">Full Name*</label>
          <input type="text" placeholder={"Your fullname"} value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full text-black border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-green-600 text-lg mb-2">Bio*</label>
          <textarea
            id="message"
            onChange={(e) => {
              setBio(e.target.value)
            }}
            name="message"
            placeholder="Write something interesting about you..."
            rows={10}
            autoComplete="off"
            value={bio}
            className="w-full text-black border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none"
          ></textarea>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 mt-8">
        <h2 className="font-semibold text-pink-600 text-xl mb-4">Social Media</h2>
        {links.map((link) => (
          <div key={link.id} className="mb-2 flex items-center">
            <div className="flex-grow">
              <label className="block font-semibold text-green-600 text-lg mb-2">{link.label}</label>
              <input type="text" value={link.value} onChange={(e) => updateLinkEditing(link.id, e.target.value)} className="w-full border rounded-lg border-gray-300 bg-white text-blue-600 p-2 shadow-sm focus:ring-0 focus:outline-none" />
            </div>
            <button className="ml-2 text-white" onClick={() => updateLink(link.id)}><UilCheck size={25} color='green' /></button>
            <button className="ml-2 text-red-500" onClick={() => removeLink(link.id)}><UilTimes size={25} color='#ee009d' /></button>
          </div>
        ))}
        {
          showAddLink
            ?
            <>
              <div className="my-3">
                <Divider />
              </div>
              <div className="my-3">
                <label className="block font-semibold text-green-600 text-lg mb-2">Label</label>
                <input type="text" value={newLink} onChange={(e) => setNewLink(e.target.value)} className="w-full border rounded-lg border-gray-300 bg-white text-blue-600 p-2 shadow-sm focus:ring-0 focus:outline-none" />
              </div>
              <div className="my-3">
                <label className="block font-semibold text-green-600 text-lg mb-2">Value</label>
                <input type="text" value={newLinkValue} onChange={(e) => setNewLinkValue(e.target.value)} className="w-full border rounded-lg border-gray-300 bg-white text-blue-600 p-2 shadow-sm focus:ring-0 focus:outline-none" />
              </div>
              <div className="flex justify-start space-x-4 mt-8">
                <Button bg={"#ee009d"} color={"white"} isLoading={loading} onClick={addLink} py={2} px={8} fontSize={"large"} fontWeight={"600"} rounded={"lg"} className="bg-pink-600">Add</Button>
                <button onClick={() => {
                  setNewLink("")
                  setNewLinkValue("")
                  setShowAddLink(false)
                }} className="text-green-600 text-lg py-2 px-4 rounded">Cancel</button>
              </div>
            </>
            :
            <button className="text-pink-600 text-lg" onClick={() => setShowAddLink(true)}>Add more link</button>
        }
      </div>

      <div className="bg-white rounded-2xl p-8 mt-8">
        <label className="block font-semibold text-[#ee009d] text-xl tracking-wide mb-2">Address & Location</label>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label className="block font-semibold text-green-600 text-lg mb-2">Country*</label>
            <select onChange={(e) => {
              if (e.target.value === "") {
                setStates([]);
              } else {
                getStates(e.target.value)
                setUserCountry(e.target.value)
              }
            }} className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none" defaultValue="">
              <option value="" disabled>Country</option>
              {
                countries.map((c: any) => (
                  <>
                    {
                      user_country === c.code ?
                        <option selected value={c.code} >{c.name}</option>
                        :
                        <option value={c.code} >{c.name}</option>
                    }
                  </>
                ))
              }
            </select>
          </div>
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label className="block font-semibold text-green-600 text-lg mb-2">City*</label>
            <input value={user_city}
              onChange={(e) => {
                setUserCity(e.target.value)
              }} type="text" placeholder="" className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none" />
          </div>
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label className="block font-semibold text-green-600 text-lg mb-2">Zip Code*</label>
            <input onChange={(e) => {
              setUserZipCode(e.target.value)
            }} value={user_zipcode} type="text" placeholder="1708" className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none" />
          </div>
          <div className="w-full sm:w-1/2 px-2 mb-4">
            <label className="block font-semibold text-green-600 text-lg mb-2">State*</label>
            <select onChange={(e) => {
              setUserState(e.target.value)
            }} className="w-full border rounded-lg border-gray-300 bg-white p-2 shadow-sm focus:ring-0 focus:outline-none" defaultValue="">
              <option value="" disabled>State</option>
              {
                profile.state !== "" && <option value={user_state}>{user_state}</option>
              }
              {
                states.map((state) => (
                  <option key={state.name} value={state.name}>{state.name}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="mb-2">
          <MapComponent />
        </div>
      </div>

      <div className="flex justify-start space-x-4 mt-8">
        <Button bg={"#ee009d"} color={"white"} isLoading={loading} onClick={updateProfile} py={2} px={8} fontSize={"large"} fontWeight={"600"} rounded={"lg"} className="bg-pink-600">Save</Button>
        <button onClick={() => navigate("/dashboard")} className="text-green-600 text-lg py-2 px-4 rounded">Cancel</button>
      </div>
    </section>
  );
};

export default ProfileImageUpload;
