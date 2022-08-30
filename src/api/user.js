// 用户想关请求模块
import request from '@/utils/request.js'
// import store from '@/store/index.js'
export const login = (data) => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}

// 发送验证码模块
// 注意：每手机号每分钟1次
export const sendSms = (mobile) => {
        return request({
            method: 'GET',
            url: `/v1_0/sms/codes/${mobile}`
        })

    }
    // 获取用户自己的信息模块
export const getUserInfo = () => {
        return request({
            method: 'GET',
            url: '/v1_0/user',
            // 发送请求头数据
            // headers: {
            //     // 注意：该接口需要授权才能访问
            //     // token的数据格式： Bearer token数据，注意，Bearer 后面有个空格
            //     Authorization: `Bearer ${store.state.user.token}`

            // }
        })

    }
    // 获取频道列表数据
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels',

    })

}

// 添加关注用户
export const addFollow = (target) => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target
        }

    })

}


// 取消关注用户
export const deleteFollow = (target) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${target}`,

    })

}

// 获取用户个人资料
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/profile',

    })

}

// 更新用户个人资料
export const updateUserProfile = (data) => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data


    })

}

// 更新用户个人头像
export const updateUserPhoto = (data) => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data


    })

}