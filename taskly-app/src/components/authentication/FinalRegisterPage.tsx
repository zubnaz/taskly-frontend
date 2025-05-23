import '../../styles/authentication/final-register-style.scss';
import password_hide from '../../assets/icon/password_hide.png';
import password_view from '../../assets/icon/password_view.png';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordValidationShema, PasswordValidationType } from '../../validation_types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputMessage, typeOfMessage } from '../general/InputMessage';
import too_weak_password from '../../assets/icon/too_weak_icon.png';
import weak_password from '../../assets/icon/weak_icon.png';
import medium_password from '../../assets/icon/medium_icon.png';
import strong_password from '../../assets/icon/strong_icon.png';
import { passwordStrength } from 'check-password-strength'
import { useAppDispatch, useRootState } from '../../redux/hooks';
import { getAllAvatarsAsync, registerAsync } from '../../redux/actions/authenticateAction';
import { baseUrl } from '../../axios/baseUrl';
import { IRegisterRequest } from '../../interfaces/authenticateInterfaces';
import { Loading } from '../general/Loading';
import { GeneralMode } from '../general/GeneralModal';
import { useNavigate } from 'react-router-dom';
import { addInformation } from '../../redux/slices/generalSlice';
import { TypeOfInformation } from '../../interfaces/generalInterface';

export const FinalRegisterPage = () => {

    const navigate = useNavigate();

    const avatarsRef = useRef<HTMLDivElement | null>(null);

    const verificatedEmail = useRootState(s => s.authenticate.verificatedEmail);
    const avatars = useRootState(s => s.authenticate.avatars);
    const [passwordIsView, setPasswordIsView] = useState<boolean>(false);
    const [confirmPasswordIsView, setConfirmPasswordIsView] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [selectedAvatar, selectAvatar] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string>("");
    const [openAvatarContainer, setOpenAvatarContainer] = useState<boolean>(false);
    const [avatarsOverflowY, setAvatarsOverflowY] = useState<"auto" | "scroll">("auto")

    const dispatch = useAppDispatch();

    const passwordStrengthColors = [
        "red",
        "orange",
        "yellow",
        "green"];

    const passwordStrengthIcons = [
        too_weak_password,
        weak_password,
        medium_password,
        strong_password];

    const {
        register,
        handleSubmit,
        trigger,
        formState: {
            isSubmitting,
            errors
        }
    } = useForm<PasswordValidationType>({
        resolver: zodResolver(PasswordValidationShema),
        mode: "onChange"
    })

    const getPasswordStrength = (password: string) => {
        const strength = passwordStrength(password).id;
        return strength;
    }
    const getAvatars = async () => {
        await dispatch(getAllAvatarsAsync())
    }
    useEffect(() => {
        getAvatars();

    }, [])
    useEffect(() => {
        if (avatars && selectedAvatar == null) {
            setAvatar(avatars[0].name);
            selectAvatar(avatars[0].id);

        }
    }, [avatars])
    useEffect(() => {
        if (avatars && selectedAvatar != null) {
            const avatarName = avatars.find(el => el.id === selectedAvatar)?.name;
            if (avatarName)
                setAvatar(avatarName);
        }

    }, [selectedAvatar])
    useEffect(() => {
        if (avatarsRef.current) {
            setAvatarsOverflowY(avatarsRef.current.offsetHeight < avatarsRef.current.scrollHeight ?
                "scroll" :
                "auto")
        }

    }, [avatarsRef.current])


    const registerSubmit = async (obj: PasswordValidationType) => {
        if (!selectedAvatar) return;
        const request: IRegisterRequest = {
            email: verificatedEmail || "",
            password: obj.password,
            confirmPassword: obj.confirmPassword,
            avatarId: selectedAvatar
        }
        var response = await dispatch(registerAsync(request));

        if (!registerAsync.fulfilled.match(response)) {
            if (response.payload) {
                dispatch(addInformation({
                    message: response.payload.errors[0].code,
                    type: TypeOfInformation.Error
                }))
            }
            else {
                dispatch(addInformation({
                    message: response.error.message || "",
                    type: TypeOfInformation.Error
                }))
            }
        }
        else {
            navigate("/authentication/login");
        }

    }



    return (<div className="final-register-page-container">
        {isSubmitting == true && <Loading />}
        <p>Completion of registration</p>
        <form action="" onSubmit={handleSubmit(registerSubmit)}>

            <div className='password-container'>
                <input
                    {...register("password")}

                    type={passwordIsView ? "text" : "password"}
                    placeholder='Password'
                    autoComplete='password'
                    onChange={async (e) => {
                        setPassword(e.target.value);
                        register("password").onChange(e);
                        await trigger();

                    }}
                />
                <button className='password-button' onClick={(e) => {
                    e.preventDefault();
                    setPasswordIsView(!passwordIsView)
                }}>
                    <img src={passwordIsView ? password_view : password_hide} />
                </button>
                <div className='password-strength' style={{ backgroundColor: passwordStrengthColors[getPasswordStrength(password)] }}>
                    <img src={passwordStrengthIcons[getPasswordStrength(password)]} alt="" />
                </div>

            </div>
            {errors.password?.message && <InputMessage message={errors.password.message} typeOfMessage={typeOfMessage.error} />}
            <div className='password-container'>
                <input
                    {...register("confirmPassword")}
                    type={confirmPasswordIsView ? "text" : "password"}
                    placeholder='Confirm password'
                    autoComplete='confirm-password'
                />
                <button className='password-button' onClick={(e) => {
                    e.preventDefault();
                    setConfirmPasswordIsView(!confirmPasswordIsView)
                }}>
                    <img src={confirmPasswordIsView ? password_view : password_hide} />
                </button>
            </div>
            {errors.confirmPassword?.message && <InputMessage message={errors.confirmPassword.message} typeOfMessage={typeOfMessage.error} />}
            <div className='select-avatar-container'>
                <div className='selected-avatar'>
                    {avatar != "" && <img src={baseUrl + "/images/avatars/" + avatar + ".png"} alt="" />}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setOpenAvatarContainer(true)
                        }}
                    >Change avatar</button>
                </div>
                <GeneralMode
                    isOpened={openAvatarContainer}
                    selectedItem={selectAvatar}
                    onClose={() => setOpenAvatarContainer(false)}
                >
                    <div
                        ref={(ref) =>
                            avatarsRef.current = ref}
                        className="avatar-list"
                        style={{ overflowY: avatarsOverflowY }}

                    >
                        {avatars && avatars.map((element) => (
                            <img key={`${element.id}`} src={baseUrl + "/images/avatars/" + element.name + ".png"} onClick={(e) => {
                                e.preventDefault();
                                selectAvatar(element.id)
                                setOpenAvatarContainer(false);
                            }} />
                        ))}
                    </div>
                </GeneralMode>


            </div>

            <button type='submit'>Register</button>

        </form>
    </div>)
}
/*
<AvatarConatiner
                    selectAvatar={selectAvatar}
                    avatarContainerIsOpened={openAvatarContainer}
                    close={() => setOpenAvatarContainer(false)}
                />
*/