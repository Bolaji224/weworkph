import React, { useState, ChangeEvent, useRef, useContext, useEffect, FormEvent } from "react";
import { UilCalender, UilCheck, UilTimes } from "@iconscout/react-unicons";
import { Avatar, Button, Divider, useToast } from "@chakra-ui/react";
import { iProfileCompany } from "../../../models/profle";
import { iSocial } from "../../../models/social";
import { httpGetWithToken, httpGetWithoutToken, httpPostWithToken } from "../../../utils/http_utils";
import { AppContext } from "../../../global/state";

interface FormData {
  email: string;
  website: string;
  foundedDate: Date | null;
  companySize: number;
  phoneNumber: string;
  category: string;
}

const EmployerProfile: React.FC = () => {
  const { updateUser }: any = useContext(AppContext);
  const toast = useToast();

  const [profile, setProfile] = useState<iProfileCompany>({
    id: undefined,
    name: "",
    email: "",
    status: "",
    role: "",
    address: "",
    phone_no: "",
    avatar: "",
    about_company: "",
    founded: "",
    industry: "",
    country: "",
    company: "",
    website: "",
    zipcode: "",
    city: "",
    state: "",
    wallet: "",
    company_size: "",
    social_medias: [],
  });

  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [links, setLinks] = useState<iSocial[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [editing_link, setEditingLink] = useState<string>("");
  const [newLink, setNewLink] = useState<string>("");
  const [newLinkValue, setNewLinkValue] = useState<string>("");
  const [showAddLink, setShowAddLink] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const datePickerRef = useRef<any>(null);

  useEffect(() => {
    getProfile();
    getCountries();
  }, []);

  const getProfile = async () => {
    try {
      const res = await httpGetWithToken("employer/profile");
      if (!res?.data) return;

      setProfile(res.data);
      setLinks(res.data.social_medias ?? []);
      updateUser(res.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const getCountries = async () => {
    try {
      const res = await httpGetWithoutToken("countries");
      setCountries(res.data ?? []);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const getStates = async (code: string) => {
    try {
      const res = await httpGetWithoutToken(`countries/${code}`);
      setStates(res.data ?? []);
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile({
      ...profile,
      [id]: id === "company_size" ? value : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saveLoading) return;

    try {
      setSaveLoading(true);
      const resp = await httpPostWithToken("profile", profile);
      if (resp.status === "success") {
        toast({ status: "success", title: "Profile updated", duration: 5000, isClosable: true });
        getProfile();
      } else {
        toast({ status: "error", title: resp.message, duration: 5000, isClosable: true });
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelected(file);
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageSave = async () => {
    if (!selected || saveLoading) return;
    const fd = new FormData();
    fd.append("file", selected);
    try {
      setSaveLoading(true);
      const resp = await httpPostWithToken("employer/profile", fd);
      if (resp.status === "success") {
        toast({ status: "success", title: "Profile updated", duration: 5000, isClosable: true });
        getProfile();
      }
    } finally {
      setSaveLoading(false);
      setImage(null);
    }
  };

  const handleImageDelete = () => {
    setImage(null);
    setProfile({ ...profile, avatar: "" });
  };

  const updateLinkEditing = (id: number, val: string) => {
    const updatedLinks = links.map((link) => (link.id === id ? { ...link, value: val } : link));
    setLinks(updatedLinks);
    setEditingLink(val);
  };

  const addLink = async () => {
    if (!newLink || !newLinkValue || loading) return;
    try {
      setLoading(true);
      const resp = await httpPostWithToken("profile/social-add", { label: newLink, value: newLinkValue });
      if (resp.status === "success") {
        toast({ status: "success", title: "Social Media Link Added", duration: 5000, isClosable: true });
        setNewLink("");
        setNewLinkValue("");
        setShowAddLink(false);
        getProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const updateLink = async (id: number) => {
    try {
      await httpPostWithToken(`profile/social/${id}`, { value: editing_link });
      toast({ status: "success", title: "Social link updated", duration: 5000, isClosable: true });
      getProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const removeLink = async (id: number) => {
    try {
      await httpPostWithToken(`profile/social-delete/${id}`);
      toast({ status: "success", title: "Social link deleted", duration: 5000, isClosable: true });
      getProfile();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="px-2 py-8 max-w-[1100px] mx-auto">
      <div className="bg-white rounded-2xl py-8 px-[4rem] mt-8">
        <div className="flex items-center flex-wrap gap-4 py-4">
          {(profile.avatar || image) ? (
            <div className="flex items-center justify-center gap-4">
              <img
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover"
                src={image ? (image as string) : profile.avatar}
                alt="Profile"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <Avatar boxSize={{ base: 16, md: 20 }} />
            </div>
          )}

          {image ? (
            <>
              <button onClick={handleImageSave} className="text-green-600 font-600 py-2 px-4 rounded border border-green-600">
                {saveLoading ? "Loading..." : "Save"}
              </button>
              <button onClick={() => setImage(null)} className="text-red-600 font-600 py-2 px-4 rounded border">
                Cancel
              </button>
            </>
          ) : (
            <>
              <label className="cursor-pointer bg-green-100 text-green-600 font-medium py-2 px-4 rounded">
                Upload new photo
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {profile.avatar && (
                <button onClick={handleImageDelete} className="text-pink-600 py-2 px-4 rounded border border-pink-600">
                  Delete
                </button>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block font-semibold text-green-600 text-lg mb-2">Company Name*</label>
            <input
              type="text"
              id="name"
              value={profile.name ?? ""}
              onChange={handleChange}
              placeholder="Marcel Shaw"
              className="w-full text-black border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Website, Founded, Company Size, Phone, Industry */}
          <div className="flex flex-wrap -mx-2">
            {/* Website */}
            <div className="w-full px-2 mb-8">
              <label className="block text-gray-700 font-bold mb-2">Website*</label>
              <input
                type="url"
                id="website"
                value={profile.website ?? ""}
                onChange={handleChange}
                placeholder="http://somename.com"
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:outline-none"
                required
              />
            </div>

            {/* Founded Date */}
            <div className="w-full sm:w-1/2 px-2 mb-8">
              <label className="block text-gray-700 font-bold mb-2">Founded Date*</label>
              <input
                type="date"
                id="founded"
                value={profile.founded ?? ""}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:outline-none"
                required
              />
            </div>

            {/* Company Size */}
            <div className="w-full sm:w-1/2 px-2 mb-8">
              <label className="block text-gray-700 font-bold mb-2">Company Size*</label>
              <input
                type="number"
                id="company_size"
                value={profile.company_size ?? ""}
                onChange={handleChange}
                placeholder="700"
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div className="w-full sm:w-1/2 px-2 mb-8">
              <label className="block text-gray-700 font-bold mb-2">Phone Number*</label>
              <input
                type="tel"
                id="phone_no"
                value={profile.phone_no ?? ""}
                onChange={handleChange}
                placeholder="+880 01723801729"
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:outline-none"
                required
              />
            </div>

            {/* Industry */}
            <div className="w-full sm:w-1/2 px-2 mb-8">
              <label className="block text-gray-700 font-bold mb-2">Category*</label>
              <input
                type="text"
                id="industry"
                value={profile.industry ?? ""}
                onChange={handleChange}
                placeholder="Account, Finance, Marketing"
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block font-semibold text-green-600 text-lg mb-2">Bio*</label>
            <textarea
              id="about_company"
              value={profile.about_company ?? ""}
              onChange={(e) => setProfile({ ...profile, about_company: e.target.value })}
              rows={10}
              className="w-full text-black border rounded-lg border-gray-300 bg-white p-4 shadow-sm focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl mt-8">
            <h2 className="font-semibold text-pink-600 text-xl mb-4">Social Media</h2>
            {(links ?? []).map((link) => (
              <div key={link.id} className="mb-2 flex items-center">
                <div className="flex-grow">
                  <label className="block font-semibold text-green-600 text-lg mb-2">{link.label}</label>
                  <input
                    type="text"
                    value={link.value ?? ""}
                    onChange={(e) => updateLinkEditing(link.id, e.target.value)}
                    className="w-full border rounded-lg border-gray-300 bg-white text-blue-600 p-2 shadow-sm focus:ring-0 focus:outline-none"
                  />
                </div>
                <button type="button" className="ml-2 text-white" onClick={() => updateLink(link.id)}>
                  <UilCheck size={25} color="green" />
                </button>
                <button type="button" className="ml-2 text-red-500" onClick={() => removeLink(link.id)}>
                  <UilTimes size={25} color="#ee009d" />
                </button>
              </div>
            ))}

            {showAddLink ? (
              <>
                <Divider className="my-3" />
                <div className="my-3">
                  <label className="block font-semibold text-green-600 text-lg mb-2">Label</label>
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="w-full border rounded-lg border-gray-300 bg-white text-blue-600 p-2 shadow-sm focus:ring-0 focus:outline-none"
                  />
                </div>
                <div className="my-3">
                  <label className="block font-semibold text-green-600 text-lg mb-2">Value</label>
                  <input
                    type="text"
                    value={newLinkValue}
                    onChange={(e) => setNewLinkValue(e.target.value)}
                    className="w-full border rounded-lg border-gray-300 bg-white text-blue-600 p-2 shadow-sm focus:ring-0 focus:outline-none"
                  />
                </div>
                <div className="flex justify-start space-x-4 mt-8">
                  <Button
                    bg="#ee009d"
                    color="white"
                    isLoading={loading}
                    onClick={addLink}
                    py={2}
                    px={8}
                    fontSize="large"
                    fontWeight="600"
                    rounded="lg"
                  >
                    Add
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewLink("");
                      setNewLinkValue("");
                      setShowAddLink(false);
                    }}
                    className="text-green-600 text-lg py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <button className="text-pink-600 text-lg" type="button" onClick={() => setShowAddLink(true)}>
                Add more link
              </button>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-start space-x-4 mt-8">
            <button type="submit" className="bg-pink-600 text-white py-2 px-8 text-lg font-medium rounded-full">
              {saveLoading ? "saving..." : "Save"}
            </button>
            <button type="button" className="text-green-600 text-lg py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EmployerProfile;
