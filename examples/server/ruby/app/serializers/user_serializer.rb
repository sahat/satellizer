class UserSerializer < ActiveModel::Serializer
  self.root = false

  attributes :id, :displayName, :email

  def displayName
    object.display_name
  end
end
